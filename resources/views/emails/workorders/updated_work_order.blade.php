<x-mail::message>
@if($workOrder['status'] === 'Declined')
# ❌ Your Work Order Request is Declined: {{ $workOrder['id'] }}

Your work order request has been declined.

**Work Order ID:** {{ $workOrder['id'] }}  
**Location:** {{ $workOrder['location'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  

@elseif($workOrder['status'] === 'For Budget Request')
# 💰 Work Order Requires Budget: {{ $workOrder['id'] }}

Your work order requires budget approval.

**Work Order ID:** {{ $workOrder['id'] }}  
**Location:** {{ $workOrder['location'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  

@elseif(in_array($workOrder['status'], ['Assigned', 'Ongoing', 'Completed']))
# @if($workOrder['status'] === 'Assigned')👨‍🔧 @elseif($workOrder['status'] === 'Ongoing')⚡ @else ✅ @endif Work Order {{ $workOrder['status'] }}: {{ $workOrder['id'] }}

@if($workOrder['status'] === 'Assigned')
Your work order has been assigned to a maintenance personnel.
@elseif($workOrder['status'] === 'Ongoing')
Your work order is now in progress.
@else
Your work order has been completed.
@endif

**Work Order ID:** {{ $workOrder['id'] }}  
**Location:** {{ $workOrder['location'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  
**Assigned To:** {{ $workOrder['assigned_to'] }}  
@if($workOrder['status'] === 'Completed')
**Completed At:** {{ $workOrder['completed_at'] }}  
@endif

@endif

<x-mail::button :url="url('/work-orders')">
Go to Work Orders
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>
