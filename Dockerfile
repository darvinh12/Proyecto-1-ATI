FROM ubuntu

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y nano
RUN apt install -y apache2
RUN apt install -y apache2-utils
RUN apt install -y python3
RUN apt install -y python3-pip
RUN apt install -y libapache2-mod-wsgi-py3
RUN apt install -y git
RUN pip install beaker --break-system-packages
RUN apt clean

RUN git clone -b reto-7 https://github.com/darvinh12/Proyecto-1-ATI.git /var/www/html/ATI
RUN cp /var/www/html/ATI/apache-ati.conf /etc/apache2/sites-available/000-default.conf

RUN a2enmod wsgi

EXPOSE 80

CMD ["apache2ctl", "-D", "FOREGROUND"]
