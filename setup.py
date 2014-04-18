# -*- coding: utf-8 -*-
from setuptools import setup

with open('README.rst') as f:
    description = f.read()


setup(
    name='pldm',
    version='0.1.0',
    packages=['pldm'],
    license=u'BSD 2-Clause License',
    long_description=description,
    include_package_data=True,
    install_requires=[
        'docutils==0.11',
        'elasticsearch==1.0.0',
        'httplib2==0.9',
        'Jinja2==2.7.2',
        'lxml==3.3.4',
        'patchit==1.1',
        'python-dateutil==2.2',
        'redis==2.9.1',
        'tornado==3.2',
        'Sphinx==1.2.2',
    ],
)
