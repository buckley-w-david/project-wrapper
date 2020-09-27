import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from colour_sort import verify
from PIL import Image
import numpy as np

bp = Blueprint('colour-sort', __name__, url_prefix='/colour-sort')

@bp.route('/', methods=[ 'POST' ])
def create_colour_sort():
    return 'OK'

@bp.route('/verify', methods=[ 'POST' ])
def verify_image():
    f = request.files['image']
    im = Image.open(f)
    try:
        return str(verify.verify_image(im))
    except:
        return 'False'
