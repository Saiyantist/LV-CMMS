@component('mail::message')
# Work Order Assigned

Hello {{ $data['name'] }},

You’ve been assigned a new work order.

**Task:** {{ $data['description'] }}  
**Due Date:** {{ $data['due_date'] }}

@component('mail::button', ['url' => url('/')])
Open CMMS
@endcomponent

Thanks,<br>
CMMS Notification Bot
@endcomponent