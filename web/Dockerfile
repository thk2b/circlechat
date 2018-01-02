FROM python:3.6.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD ./requirements.txt /usr/src/app/requirements.txt

RUN pip install -r requirements.txt

ADD . /usr/src/app

EXPOSE 8080

CMD ["gunicorn", "--bind", "0.0.0.0:8080","--worker-class", "eventlet", "-w", "1", "manage:app"]