<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'SupermercadoYpacarai')
<img src="https://api.ecommercesy.com/images/icono-super.png" class="logo" alt="Talleres Logo">
@else
{{ $slot }}
@endif
</a>
</td>
</tr>
