/*
	Photon by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
!function(l){var x=l(window),o=l("body");breakpoints({xlarge:["1141px","1680px"],large:["981px","1140px"],medium:["737px","980px"],small:["481px","736px"],xsmall:["321px","480px"],xxsmall:[null,"320px"]}),x.on("load",function(){window.setTimeout(function(){o.removeClass("is-preload")},100)}),l(".scrolly").scrolly()}(jQuery);
//----------------------
const secretSkins = {
	'Y29vbCBndXk=': 'playerSkin3',
}

const specialSkins = {
	'zkfFpao1kiJRVAEn7pECkg==': 'playerSkin2',
	'EtU92w7c6zjOf8SiaA/4Gw==': 'playerSkin4',
}

let info={};const loadLocalStorage=()=>{let e=localStorage.getItem("insanity2Info");info=JSON.parse(e)};loadLocalStorage();const saveLocalStorage=()=>{localStorage.setItem("insanity2Info",JSON.stringify(info))};let colorPicker=document.querySelector("#color-picker"),secretSkinPicker=document.querySelector("#secret-skin"),specialSkinPicker=document.querySelector("#special-skin");const setNewSkin=e=>{if("color"===e)info.playerSkin="playerSkin1",info.skinColor=colorPicker.value.replace(/\#/,""),saveLocalStorage();else if("secretSkin"===e){let e=secretSkinPicker.value;for(let i in secretSkins){if(e===i){(info.playerSkin=secretSkins[i],saveLocalStorage())}}}else if("specialSkin"===e){let e=specialSkinPicker.value;for(let i in specialSkins){if(e===i){(info.playerSkin=specialSkins[i],saveLocalStorage())}}}};