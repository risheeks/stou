import React from 'react'
import './index.css'
import SubBody01 from './subBody01.js'
import SubBody02 from './subBody02.js'
import SubBody03 from './subBody03.js'
import SubBody04 from './subBody04.js'
import { Container, Button } from "react-bootstrap";

const privacyPolicy = () => {
	return(
		<Container className = 'about'> 
			<h1>Privacy Policy</h1>
			<p>Stou values the privacy of the users who use our web service. And, we want you to be aware of how we collect, use, share information of the users. This applies to customers, people who want to get food, and home cooks, people who cook the food and are willing to share. By using our platform, you, as a user, agree to the terms and conditions of the Privacy Policy, which includes future additions and changes. In case, if you do not agree with any of the terms and conditions, please do not use the website.</p>
			<SubBody01/>
			<SubBody02/>
			<SubBody03/>
			<SubBody04/>
            <Button type='submit'>Accept</Button>

		</Container>
	)
	
}
export default privacyPolicy