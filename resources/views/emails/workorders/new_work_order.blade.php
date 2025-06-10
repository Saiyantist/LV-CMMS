<x-mail::message>
# 📝 Incoming Work Order Request: {{ $workOrder['id'] }}

A new work order request has been submitted.

**Requested By:** {{ $workOrder['requested_by'] }}  
**Requested At:** {{ $workOrder['requested_at'] }}  
**Location:** {{ $workOrder['location'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  

<x-mail::button :url="url('/work-orders')">
Go to Work Orders
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>