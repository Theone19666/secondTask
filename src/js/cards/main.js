import '../../img/general/logo.png';
import '../../img/general/expand_more.png';
import '../../img/general/arrow_forward.png';
import '../../fonts/Montserrat/Montserrat-Bold.ttf';
import '../../fonts/Montserrat/Montserrat-Regular.ttf';
import '../../fonts/Quicksand/Quicksand-Bold.ttf';
import '../../fonts/Quicksand/Quicksand-Regular.ttf';
import '../../fonts/Montserrat/Montserrat-Medium.ttf';
import '../../scss/cards.scss';
// import flatpickr from 'flatpickr';


const flatpickr = require('flatpickr');

flatpickr('.dateDropdown', { mode: 'range', dateFormat: 'd-m-Y' });
