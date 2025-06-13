<x-mail::message>
# 🚨 Cancelled Work Order: {{ $workOrder['id'] }}

A work order has been cancelled.

**Work Order ID:** {{ $workOrder['id'] }}  
**Cancelled By:** {{ $workOrder['requested_by'] }} (*User ID: {{ $workOrder['user_id'] }}*)  
**Location:** {{ $workOrder['location'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  

<x-mail::button :url="url('/work-orders')">
Go to Work Orders
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>
