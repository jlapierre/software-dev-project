import subprocess
from threading import Lock
from server.config.private import YT_LIVESTREAM_KEY


# Class to manage FFMPEG streaming subprocess - hopefully async safe
class FFMPEG:

    live_stream = None
    lock = Lock()

    def __init__(self):
        pass

    def start_stream(self, server, input_link):
        """
        Starts a YT live stream using FFMPEG
        :param server: url to the peerflix-server
        :param input_link: link to input file
        :return: boolean if started successfully
        """
        if self.is_streaming():
            return False
        with self.lock:
            commands = ['ffmpeg', '-re', '-i', '{0}{1}'.format(server, input_link), '-c:v', 'libx264', '-crf', '27',
                        '-preset', 'superfast',
                        '-c:a', 'aac', '-b:a', '160k', '-ac', '2', '-ar', '44100', '-f', 'flv', '-strict', '-2',
                        'rtmp://a.rtmp.youtube.com/live2/{0}'.format(YT_LIVESTREAM_KEY)]
            FFMPEG.live_stream = subprocess.Popen(commands, stdout=subprocess.PIPE)
            return True

    def is_streaming(self):
        """
        Checks to see if subprocess is streaming
        :return: Boolean
        """
        with self.lock:
            try:
                if self.live_stream.poll() is None:
                    return True
                else:
                    FFMPEG.live_stream = None
                    return False
            except AttributeError:
                # None type won't have poll()
                return False

    def stop_streaming(self):
        """
        Stops subprocess if it is open
        :return: Boolean
        """
        if not self.is_streaming():
            return True
        else:
            with self.lock:
                self.live_stream.terminate()
                FFMPEG.live_stream = None
                return True
