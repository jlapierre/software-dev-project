import json
import requests
import time
from threading import Thread
from classes.FFMPEG import FFMPEG
from server.config.private import YT_CHANNEL
from server.config.private import PEERFLIX_SERVER


# Function for a pre-defined test to start torrent to youtube
def example_test():
    # Options to send to the peerflix-server
    options = {
        "headers": {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "*/*"
        },
        "url": '{0}/torrents'.format(PEERFLIX_SERVER),
        "body": '{"link": "magnet:?xt=urn:btih:4b642d022980e5ebaa7cf4b6e1cc93769921cb42&dn=The+Wolf+of+Wall+Street+%282013%29+1080p+BrRip+x264+-+YIFY&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Fzer0day.ch%3A1337&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Fpublic.popcorn-tracker.org%3A6969"}'
    }
    # Send request to peerflix-server
    torrent_hash = start_torrent(options)

    # Wait for 10 seconds to allow torrent to process
    time.sleep(10)

    # Get the torrent streaming link
    torrent_link = get_max_file(torrent_files(PEERFLIX_SERVER, torrent_hash))['link']

    success = FFMPEG().start_stream(PEERFLIX_SERVER, torrent_link)
    if success:
        return YT_CHANNEL
    else:
        return 'Failed to start the FFMPEG live stream.... :{'
    
    
def start_torrent_stream(magnet_link, delayed=None):
    """
    Is the controller endpoint for the slack request to start a torrent
    :param magnet_link: Link of a torrent
    :param delayed: response_url to send message to if delayed
    :return string response
    """
    # Options to send to the peerflix-server
    options = {
        "headers": {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "*/*"
        },
        "url": '{0}/torrents'.format(PEERFLIX_SERVER),
        "body": json.dumps({"link": magnet_link})
    }
    # Doesn't continue if a stream is already in progress
    if FFMPEG().is_streaming():
        return 'A stream is already in process. Check it out @ {0}'.format(YT_CHANNEL)
    # Send request to peerflix-server
    torrent_hash = start_torrent(options)

    # Wait for 10 seconds to allow torrent to process
    time.sleep(10)

    # Get the torrent streaming link
    torrent_link = get_max_file(torrent_files(PEERFLIX_SERVER, torrent_hash))['link']

    success = FFMPEG().start_stream(PEERFLIX_SERVER, torrent_link)
    if success:
        resp = YT_CHANNEL
    else:
        resp = "Failed to start the FFMPEG live stream.... :{"
    if delayed:
        requests.post(delayed, data=json.dumps({"text": resp}), headers={'Content-Type': 'application/json'})
    else:
        return resp
    
    
def start_torrent_stream_delayed_response(magnet_link, response_url):
    """
    Will send a basic text response first followed by a detailed reponse post-process
    :param magnet_link: link to torrent
    :param response_url: Url to post to for delayed response
    :return String please wait for further response
    """
    t = Thread(target=start_torrent_stream, args=(magnet_link, response_url,))
    t.start()
    return 'Process started. Please wait to hear from us in approx. 30 seconds!'

    
def error():
    """
    Function to handle a large error
    :return: error message
    """
    return 'There was some kinda error. Server may have died'
   

def stop_torrent_stream():
    """
    Is the controller endpoint for the slack request to stop torrents
    :return string response
    """
    # Options to send to the peerflix-server
    options = {
        "headers": {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "*/*"
        },
        "url": '{0}/torrents'.format(PEERFLIX_SERVER)
    }

    success = FFMPEG().stop_streaming()
    stop_torrents(options)
    if success:
        return 'Stopped the YT live stream and torrents!'
    else:
        return 'Failed to stop the FFMPEG live stream.... :{'  


def start_torrent(options):
    """
    Starts a torrent on the peerflix-server
    :param options: contains url for server, body with magnet link, and headers
    :return: a hash for the torrent process
    """
    response = requests.post(options['url'], headers=options['headers'], data=options['body'])
    return response.json()['infoHash']


def stop_torrents(options):
    """
    Stops all torrents on the peerflix-server
    :param options: contains url for server and headers
    :return: a boolean if successful 
    """
    torrent_hashes = requests.get(options['url'], headers=options['headers']).json()
    for t in torrent_hashes:
        requests.delete(options['url'] + '/{0}'.format(t['infoHash']), headers=options['headers'])
    return True


def torrent_files(server_url, torrent_hash):
    """
    Gets list of files that makes up the torrent
    :param server_url: url for peerflix-server
    :param torrent_hash: hash for the torrent job
    :return: array of file objects
    """
    response = requests.get(server_url + '/torrents/' + torrent_hash)
    torrent = response.json()
    return torrent['files']


def get_max_file(files):
    """
    Finds the largest file in an array of files
    :param files: an array of peerflix-files
    :return: largest file
    """
    max_length = 0
    max_file = None
    for f in files:
        if f['length'] > max_length:
            max_length = f['length']
            max_file = f
    return max_file
