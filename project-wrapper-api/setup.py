from setuptools import find_packages, setup

setup(
    name='wrapper-api',
    version='0.1.0',
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        'flask>=1.0.0',
        'colour-sort',
        'gunicorn'
    ],
)
