<x-mail::message>
# 👨‍🔧 New Work Order Assignment: {{ $workOrder['id'] }}

You have been assigned a new work order.

**Work Order ID:** {{ $workOrder['id'] }}  
**Requested By:** {{ $workOrder['requested_by'] }}  
**Requested At:** {{ $workOrder['requested_at'] }}  
**Target Date:** {{ $workOrder['scheduled_at'] }}  
**Priority:** {{ $workOrder['priority'] }}  
**Location:** {{ $workOrder['location'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  
@if($workOrder['remarks'])
**Remarks:** {{ $workOrder['remarks'] }}  
@endif

<x-mail::button :url="url('/work-orders/assigned-tasks')">
View Assigned Tasks
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>
