<?php

/* This script receives the JSON object from Primo, and sends an email to staff     */
/*  Customize lines 24-39 as necessary. At minimum, edit lines 22 & 23 with appropriate email addresses */

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	# if no data is received, return error.
        if(!isset($request){header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);}
	$title=$request->title;
	$author=$request->author;
	$course=$request->course;
	$courseTitle=$request->courseTitle;
	$instructor=$request->instructor;
	$location=$request->location;
	$availability=$request->availability;
	$url=$request->url;
	$loanRule=$request->loanRule;
	$callNumber=$request->callNumber;
  $comments=$request->comments;

  /* customize as necessary :  */

  $to= "reserves@mylibrary.edu"; /* the email recipient  */
  $headers = "From: My Library <reserves@mail.com>" . "\r\n";
  $subject ="Course Reserve Request: $title";
  $message="$instructor has submitted the following course reserves request:\n\n";
  $message.="Title: $title\n";
	$message.="Author: $author\n";
	$message.="Call Number: $callNumber\n";
	$message.="Location: $location\n";
	$message.="Availability: $availability\n\n";
  $message.="URL: $url\n\n";
  $message.="Course: $course \n";
  $message.="Course Title: $courseTitle\n";
  $message.="Instructor: $instructor \n";
  $message.="Reserve Loan Period: $loanRule  \n";
  $message.="Comments: $comments  \n";
  $message.="Please fill this request within 24 hours.";

  /* end customization */

  if (mail($to, $subject, $message, $headers)){
		header("HTTP/1.1 200 OK");
  }
  else {header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);}

?>
