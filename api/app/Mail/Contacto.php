<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class Contacto extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $email;
    public $asunto;
    public $mensaje;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->nombre = $data['nombre'];
        $this->email = $data['email'];
        $this->asunto = $data['asunto'];
        $this->mensaje = $data['mensaje'];
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from($this->email)
                    ->subject($this->asunto)
                    ->view('mail.contactar');
    }
}
