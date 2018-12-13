/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1141px',  '1680px' ],
			large:    [ '981px',   '1140px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '321px',   '480px'  ],
			xxsmall:  [ null,      '320px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Scrolly.
		$('.scrolly').scrolly();

})(jQuery);

//----------------------

let info = {}
const loadLocalStorage = () => {
	let i = localStorage.getItem('insanity2Info')
	info = JSON.parse(i)
}
loadLocalStorage()

const saveLocalStorage = () =>{
	localStorage.setItem('insanity2Info', JSON.stringify(info))
}

let colorPicker = document.querySelector('#color-picker')
let secretSkinPicker = document.querySelector('#secret-skin')
let specialSkinPicker = document.querySelector('#special-skin')

const setNewSkin = () => {
	info.skinColor = colorPicker.value.replace(/\#/, '')
	saveLocalStorage()
}

const specialSkins = {
	'zkfFpao1kiJRVAEn7pECkg==': 'playerSkin2',
	'EtU92w7c6zjOf8SiaA/4Gw==': 'playerSkin4',
}

const redeemSpecialSkin = (e) => {
	console.log('here')
	if (e.key === 'Enter') {
		let code = secretSkinPicker.value
		for (let item in secretSkins) {
			if (code === item) {
				info.playerSkin = item
				saveLocalStorage()
			}
		}
	}
}

let secretSkins = {
	'Y29vbCBndXk=': 'playerSkin3',
}

const redeemSecretSkin = e => {
	if (e.key === 'Enter') {
		let code = secretSkinPicker.value
		for (let item in secretSkins) {
			if (code === item) {
				info.playerSkin = item
				saveLocalStorage()
			}
		}
	}
}

specialSkinPicker.onkeydown = redeemSpecialSkin
secretSkinPicker.onkeydown = redeemSecretSkin