<x-mail::message>
# Preventive Maintenance for Asset #{{ $workOrder['asset_id'] }}

A preventive maintenance work order has been auto-generated for asset {{ $workOrder['asset_name'] }}.

**PM Work Order ID:** {{ $workOrder['work_order_id'] }}  
**Asset Name/ID:** {{ $workOrder['asset_name'] }} - {{ $workOrder['asset_id'] }}  
**Location:** {{ $workOrder['asset_location_name'] }}  
**Report Description:** {{ $workOrder['report_description'] }}  
**Scheduled At:** {{ $workOrder['scheduled_at'] }}  
**Maintenance Schedule ID:** {{ $workOrder['maintenance_schedule_id'] }}  

<x-mail::button :url="url('/work-orders/preventive-maintenance')">
Go to Preventive Maintenance Work Orders
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>
