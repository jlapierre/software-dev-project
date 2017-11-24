# if workspace does not exist, create in root of project dir
source $(dirname $0)/ensure_workspace.sh

PYENV_HOME=$WORKSPACE/.pyenv/

# Clean workspace
bash -e test/clean.sh

# Create virtualenv and install necessary packages
virtualenv $PYENV_HOME -p python2.7
. $PYENV_HOME/bin/activate
pip install --quiet -r requirements.txt

coverage run --source=src $(which lettuce) -v 3 --with-xunit tests/features/
echo $(coverage xml -o coverage2.xml || true)
# if coverage produced empty .xml FIX invalid xml build fail for cobertura
if [ ! -s coverage2.xml ]; then rm coverage2.xml; fi