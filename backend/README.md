# Setup
## debian/ubuntu
create ImageBoard database

```
sudo apt-get install mysql-server
sudo apt-get install libmariadbclient-dev
sudo apt-get install python3-dev
```

```
git clone https://gitlab.com/1BilderBrett/backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
```
```
pip3 install -U wheel
pip3 install python-magic
pip3 install -r requirements.txt
```