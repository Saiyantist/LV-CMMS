<x-mail::message>
# Account approved 🎉

Your account has been approved.

**Role:** {{ $user['role'] }}  

<x-mail::button :url="url('/dashboard')">
Go to your Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }} (Do not reply to this email)
</x-mail::message>