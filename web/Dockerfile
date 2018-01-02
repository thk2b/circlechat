FROM python:3.6.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD ./requirements.txt /usr/src/app/requirements.txt

RUN pip install -r requirements.txt

ADD . /usr/src/app

EXPOSE 8080
# uwsgi --http :5000 --gevent 1000 --http-websockets --master --wsgi-file app.py --callable app
CMD ["uwsgi", "--module", "manage:app", "--http", ":8080", "--gevent", "1000", "--http-websockets"]