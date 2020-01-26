from flask import render_template
from flask_login import current_user, login_required

from app.settings import bp


@bp.route('/settings', methods=['GET', 'POST'])
@login_required
def settings():
    return render_template(
        'main/settings.html',
        current_user=current_user,  # for base.html
        rooms=current_user.get_sorted_rooms_by_timestamp(current_user),  # for base.html
    )
