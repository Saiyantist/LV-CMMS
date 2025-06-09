<x-mail::message>
# New User Registered 🙋🏻‍♂️

A new user has registered and is awaiting for approval.

**Name:** {{ $user['name'] }}  
**Email:** {{ $user['email'] }}

@if (!is_null($user['staff_type']))
**Staff Type:** {{ $user['staff_type'] }}

    @if ($user['staff_type'] === 'maintenance_personnel')
**Work Group:** {{ $user['work_group'] ?? 'N/A' }}
    @elseif (in_array($user['staff_type'], ['teaching', 'non-teaching']))
**Department:** {{ $user['department'] ?? 'N/A' }}
    @endif
@elseif (is_null($user['staff_type']))
*This an external user.*
@endif

<x-mail::button :url="url('/admin/manage-roles')">
Review & Assign Role
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>