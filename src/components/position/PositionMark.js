import React from "react";
import GoogleMapReact from 'google-map-react';

export default function PositionMark(){

  return (
    // Important! Always set the container height explicitly
    <center>
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282.844926171463!2d100.20395859999999!3d16.741254150000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30dfbe981f069d3b%3A0xa80eb30c21ba8200!2sFaculty%20of%20Science!5e0!3m2!1sen!2sth!4v1631191947267!5m2!1sen!2sth" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </center>
    
  );
}
