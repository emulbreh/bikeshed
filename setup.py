# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

with open('README.rst') as f:
    description = f.read()


setup(
    name='bikeshed',
    version='0.1.0',
    packages=find_packages(),
    license=u'BSD 3-Clause License',
    long_description=description,
    include_package_data=True,
    install_requires=[
        'bcrypt>=1.0.2',
        'docutils>=0.11',
        'elasticsearch>=1.0.0',
        'httplib2>=0.9',
        'Jinja2>=2.7.2',
        'lxml>=3.3.4',
        'patchit>=1.1',
        'python-dateutil>=2.2',
        'redis>=2.9.1',
        'Sphinx>=1.2.2',
        'itsdangerous>=0.24',
        'Werkzeug==0.9.4',
        'gunicorn==18.0',
    ],
)
