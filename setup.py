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
        'python-dateutil==2.2',
        'tornado==3.2',
        'Jinja2==2.7.2',
    ],
)
