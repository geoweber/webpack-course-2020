import Post from './Post';
import './styles/styles.css';
import json from './assets/json';
import PolarExpress from './assets/polar-express.jpg';
import xml from './assets/data.xml';
import './babel';

import * as $ from 'jquery';

import './styles/less.less';
import './styles/scss.scss';

import { render } from 'react-dom';
import React from 'react';

const post = new Post('Webpack post title', PolarExpress);
//console.log('Post to string , ', post.toString());

//$('pre').addClass('code').html(post.toString());

//console.log('JSON: ', json);

//console.log('XML: ', xml);

const App = () => (
	<div className='container'>
		<h1>Webpack course</h1>
		<div className='logo' />
		<hr />
		<pre></pre>

		<div className='box'>
			<h2>Less</h2>
		</div>

		<div className='card'>
			<h2>Sass.</h2>
		</div>
	</div>
);
render(<App />, document.getElementById('app'));
