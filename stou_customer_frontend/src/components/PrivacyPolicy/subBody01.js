import React from 'react'
import './index.css'
import { Container } from "react-bootstrap";


const SubBody01 = () => {
	return(
		<Container className = 'subBody'>
		 	<h2>Information provided by the Users</h2>
			<p>We collect information in a variety of circumstances when you use our website.</p>
			<p>Some instances of those circumstances as follows.</p> 
			<ul>
				<li>When you register, you provide us with information regarding email, first name, last name, email, etc. After signing up, you are in a position to provide more information about you, to us. This information would be stored in our database. However, it will be encrypted for your privacy.</li>
				<li>When you use a card to pay, a third-party payment service receives your card information. We do not store that information in our database.</li>
				<li>When you use our website to rate a home cook, we will save it on the database. However, it will be protected.</li>
			</ul>
			<p>When we collect information about, it is to provide a good service for you. For example, we use your username and password to uniquely identify you. We also receive information when you interact with another user (home cooks or/and customers). We can make a promise that all the information we are collecting will be used to enhance the user experience.</p>
		</Container>
	)	
}
export default SubBody01