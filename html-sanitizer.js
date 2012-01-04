



<!DOCTYPE html>
<html>
<head>
 <link rel="icon" type="image/vnd.microsoft.icon" href="http://www.gstatic.com/codesite/ph/images/phosting.ico">
 
 
 <script type="text/javascript">
 
 (function(){function a(b){this.t={};this.tick=function(b,d,e){d=void 0!=e?e:(new Date).getTime();this.t[b]=d};this.tick("start",null,b)}var c=new a;window.jstiming={Timer:a,load:c};try{var f=null;window.chrome&&window.chrome.csi&&(f=Math.floor(window.chrome.csi().pageT));null==f&&window.gtbExternal&&(f=window.gtbExternal.pageT());null==f&&window.external&&(f=window.external.pageT);f&&(window.jstiming.pt=f)}catch(g){};})();

 
 
 
 
 var codesite_token = null;
 
 
 var CS_env = {"profileUrl":null,"token":null,"assetHostPath":"http://www.gstatic.com/codesite/ph","domainName":null,"assetVersionPath":"http://www.gstatic.com/codesite/ph/1847340689237817661","projectHomeUrl":"/p/google-caja","relativeBaseUrl":"","projectName":"google-caja","loggedInUserEmail":null};
 var _gaq = _gaq || [];
 _gaq.push(
 ['siteTracker._setAccount', 'UA-18071-1'],
 ['siteTracker._trackPageview']);
 
 _gaq.push(
 ['projectTracker._setAccount', 'UA-118355-4'],
 ['projectTracker._trackPageview']);
 
 
 </script>
 
 
 <title>html-sanitizer.js - 
 google-caja -
 
 
 A source-to-source translator for securing Javascript-based web content - Google Project Hosting
 </title>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" >
 <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" >
 
 <meta name="ROBOTS" content="NOARCHIVE">
 
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/1847340689237817661/css/core.css">
 
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/1847340689237817661/css/ph_detail.css" >
 
 
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/1847340689237817661/css/d_sb.css" >
 
 
 
<!--[if IE]>
 <link type="text/css" rel="stylesheet" href="http://www.gstatic.com/codesite/ph/1847340689237817661/css/d_ie.css" >
<![endif]-->
 <style type="text/css">
 .menuIcon.off { background: no-repeat url(http://www.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 -42px }
 .menuIcon.on { background: no-repeat url(http://www.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 -28px }
 .menuIcon.down { background: no-repeat url(http://www.gstatic.com/codesite/ph/images/dropdown_sprite.gif) 0 0; }
 
 
 
  tr.inline_comment {
 background: #fff;
 vertical-align: top;
 }
 div.draft, div.published {
 padding: .3em;
 border: 1px solid #999; 
 margin-bottom: .1em;
 font-family: arial, sans-serif;
 max-width: 60em;
 }
 div.draft {
 background: #ffa;
 } 
 div.published {
 background: #e5ecf9;
 }
 div.published .body, div.draft .body {
 padding: .5em .1em .1em .1em;
 max-width: 60em;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 word-wrap: break-word;
 font-size: 1em;
 }
 div.draft .actions {
 margin-left: 1em;
 font-size: 90%;
 }
 div.draft form {
 padding: .5em .5em .5em 0;
 }
 div.draft textarea, div.published textarea {
 width: 95%;
 height: 10em;
 font-family: arial, sans-serif;
 margin-bottom: .5em;
 }

 
 .nocursor, .nocursor td, .cursor_hidden, .cursor_hidden td {
 background-color: white;
 height: 2px;
 }
 .cursor, .cursor td {
 background-color: darkblue;
 height: 2px;
 display: '';
 }
 
 
.list {
 border: 1px solid white;
 border-bottom: 0;
}

 
 </style>
</head>
<body class="t4">
<script type="text/javascript">
 (function() {
 var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
 ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
 (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
 })();
</script>
<div class="headbg">

 <div id="gaia">
 

 <span>
 
 <a href="#" id="projects-dropdown" onclick="return false;"><u>My favorites</u> <small>&#9660;</small></a>
 | <a href="https://www.google.com/accounts/ServiceLogin?service=code&amp;ltmpl=phosting&amp;continue=http%3A%2F%2Fcode.google.com%2Fp%2Fgoogle-caja%2Fsource%2Fbrowse%2Ftrunk%2Fsrc%2Fcom%2Fgoogle%2Fcaja%2Fplugin%2Fhtml-sanitizer.js&amp;followup=http%3A%2F%2Fcode.google.com%2Fp%2Fgoogle-caja%2Fsource%2Fbrowse%2Ftrunk%2Fsrc%2Fcom%2Fgoogle%2Fcaja%2Fplugin%2Fhtml-sanitizer.js" onclick="_CS_click('/gb/ph/signin');"><u>Sign in</u></a>
 
 </span>

 </div>

 <div class="gbh" style="left: 0pt;"></div>
 <div class="gbh" style="right: 0pt;"></div>
 
 
 <div style="height: 1px"></div>
<!--[if lte IE 7]>
<div style="text-align:center;">
Your version of Internet Explorer is not supported. Try a browser that
contributes to open source, such as <a href="http://www.firefox.com">Firefox</a>,
<a href="http://www.google.com/chrome">Google Chrome</a>, or
<a href="http://code.google.com/chrome/chromeframe/">Google Chrome Frame</a>.
</div>
<![endif]-->




 <table style="padding:0px; margin: 0px 0px 10px 0px; width:100%" cellpadding="0" cellspacing="0"
 itemscope itemtype="http://schema.org/CreativeWork">
 <tr style="height: 58px;">
 
 <td id="plogo">
 <link itemprop="url" href="/p/google-caja">
 <a href="/p/google-caja/">
 
 
 <img src="/p/google-caja/logo?cct=1319586684"
 alt="Logo" itemprop="image">
 
 </a>
 </td>
 
 <td style="padding-left: 0.5em">
 
 <div id="pname">
 <a href="/p/google-caja/"><span itemprop="name">google-caja</span></a>
 </div>
 
 <div id="psum">
 <a id="project_summary_link"
 href="/p/google-caja/"><span itemprop="description">A source-to-source translator for securing Javascript-based web content</span></a>
 
 </div>
 
 
 </td>
 <td style="white-space:nowrap;text-align:right; vertical-align:bottom;">
 
 <form action="/hosting/search">
 <input size="30" name="q" value="" type="text">
 
 <input type="submit" name="projectsearch" value="Search projects" >
 </form>
 
 </tr>
 </table>

</div>

 
<div id="mt" class="gtb"> 
 <a href="/p/google-caja/" class="tab ">Project&nbsp;Home</a>
 
 
 
 
 <a href="/p/google-caja/downloads/list" class="tab ">Downloads</a>
 
 
 
 
 
 <a href="/p/google-caja/wiki/GettingStarted?tm=6" class="tab ">Wiki</a>
 
 
 
 
 
 <a href="/p/google-caja/issues/list"
 class="tab ">Issues</a>
 
 
 
 
 
 <a href="/p/google-caja/source/checkout"
 class="tab active">Source</a>
 
 
 
 
 
 <div class=gtbc></div>
</div>
<table cellspacing="0" cellpadding="0" width="100%" align="center" border="0" class="st">
 <tr>
 
 
 
 
 
 
 <td class="subt">
 <div class="st2">
 <div class="isf">
 
 


 <span class="inst1"><a href="/p/google-caja/source/checkout">Checkout</a></span> &nbsp;
 <span class="inst2"><a href="/p/google-caja/source/browse/">Browse</a></span> &nbsp;
 <span class="inst3"><a href="/p/google-caja/source/list">Changes</a></span> &nbsp;
 
 &nbsp;
 
 
 <form action="http://www.google.com/codesearch" method="get" style="display:inline"
 onsubmit="document.getElementById('codesearchq').value = document.getElementById('origq').value + ' package:http://google-caja\\.googlecode\\.com'">
 <input type="hidden" name="q" id="codesearchq" value="">
 <input type="text" maxlength="2048" size="38" id="origq" name="origq" value="" title="Google Code Search" style="font-size:92%">&nbsp;<input type="submit" value="Search Trunk" name="btnG" style="font-size:92%">
 
 
 
 
 
 
 </form>
 </div>
</div>

 </td>
 
 
 
 <td align="right" valign="top" class="bevel-right"></td>
 </tr>
</table>


<script type="text/javascript">
 var cancelBubble = false;
 function _go(url) { document.location = url; }
</script>
<div id="maincol"
 
>

 
<!-- IE -->




<div class="expand">
<div id="colcontrol">
<style type="text/css">
 #file_flipper { white-space: nowrap; padding-right: 2em; }
 #file_flipper.hidden { display: none; }
 #file_flipper .pagelink { color: #0000CC; text-decoration: underline; }
 #file_flipper #visiblefiles { padding-left: 0.5em; padding-right: 0.5em; }
</style>
<table id="nav_and_rev" class="list"
 cellpadding="0" cellspacing="0" width="100%">
 <tr>
 
 <td nowrap="nowrap" class="src_crumbs src_nav" width="33%">
 <strong class="src_nav">Source path:&nbsp;</strong>
 <span id="crumb_root">
 
 <a href="/p/google-caja/source/browse/">svn</a>/&nbsp;</span>
 <span id="crumb_links" class="ifClosed"><a href="/p/google-caja/source/browse/trunk/">trunk</a><span class="sp">/&nbsp;</span><a href="/p/google-caja/source/browse/trunk/src/">src</a><span class="sp">/&nbsp;</span><a href="/p/google-caja/source/browse/trunk/src/com/">com</a><span class="sp">/&nbsp;</span><a href="/p/google-caja/source/browse/trunk/src/com/google/">google</a><span class="sp">/&nbsp;</span><a href="/p/google-caja/source/browse/trunk/src/com/google/caja/">caja</a><span class="sp">/&nbsp;</span><a href="/p/google-caja/source/browse/trunk/src/com/google/caja/plugin/">plugin</a><span class="sp">/&nbsp;</span>html-sanitizer.js</span>
 
 

 </td>
 
 
 <td nowrap="nowrap" width="33%" align="right">
 <table cellpadding="0" cellspacing="0" style="font-size: 100%"><tr>
 
 
 <td class="flipper">
 <ul class="leftside">
 
 <li><a href="/p/google-caja/source/browse/trunk/src/com/google/caja/plugin/html-sanitizer.js?r=4631" title="Previous">&lsaquo;r4631</a></li>
 
 </ul>
 </td>
 
 <td class="flipper"><b>r4747</b></td>
 
 </tr></table>
 </td> 
 </tr>
</table>

<div class="fc">
 
 
 
<style type="text/css">
.undermouse span {
 background-image: url(http://www.gstatic.com/codesite/ph/images/comments.gif); }
</style>
<table class="opened" id="review_comment_area"
><tr>
<td id="nums">
<pre><table width="100%"><tr class="nocursor"><td></td></tr></table></pre>
<pre><table width="100%" id="nums_table_0"><tr id="gr_svn4747_1"

><td id="1"><a href="#1">1</a></td></tr
><tr id="gr_svn4747_2"

><td id="2"><a href="#2">2</a></td></tr
><tr id="gr_svn4747_3"

><td id="3"><a href="#3">3</a></td></tr
><tr id="gr_svn4747_4"

><td id="4"><a href="#4">4</a></td></tr
><tr id="gr_svn4747_5"

><td id="5"><a href="#5">5</a></td></tr
><tr id="gr_svn4747_6"

><td id="6"><a href="#6">6</a></td></tr
><tr id="gr_svn4747_7"

><td id="7"><a href="#7">7</a></td></tr
><tr id="gr_svn4747_8"

><td id="8"><a href="#8">8</a></td></tr
><tr id="gr_svn4747_9"

><td id="9"><a href="#9">9</a></td></tr
><tr id="gr_svn4747_10"

><td id="10"><a href="#10">10</a></td></tr
><tr id="gr_svn4747_11"

><td id="11"><a href="#11">11</a></td></tr
><tr id="gr_svn4747_12"

><td id="12"><a href="#12">12</a></td></tr
><tr id="gr_svn4747_13"

><td id="13"><a href="#13">13</a></td></tr
><tr id="gr_svn4747_14"

><td id="14"><a href="#14">14</a></td></tr
><tr id="gr_svn4747_15"

><td id="15"><a href="#15">15</a></td></tr
><tr id="gr_svn4747_16"

><td id="16"><a href="#16">16</a></td></tr
><tr id="gr_svn4747_17"

><td id="17"><a href="#17">17</a></td></tr
><tr id="gr_svn4747_18"

><td id="18"><a href="#18">18</a></td></tr
><tr id="gr_svn4747_19"

><td id="19"><a href="#19">19</a></td></tr
><tr id="gr_svn4747_20"

><td id="20"><a href="#20">20</a></td></tr
><tr id="gr_svn4747_21"

><td id="21"><a href="#21">21</a></td></tr
><tr id="gr_svn4747_22"

><td id="22"><a href="#22">22</a></td></tr
><tr id="gr_svn4747_23"

><td id="23"><a href="#23">23</a></td></tr
><tr id="gr_svn4747_24"

><td id="24"><a href="#24">24</a></td></tr
><tr id="gr_svn4747_25"

><td id="25"><a href="#25">25</a></td></tr
><tr id="gr_svn4747_26"

><td id="26"><a href="#26">26</a></td></tr
><tr id="gr_svn4747_27"

><td id="27"><a href="#27">27</a></td></tr
><tr id="gr_svn4747_28"

><td id="28"><a href="#28">28</a></td></tr
><tr id="gr_svn4747_29"

><td id="29"><a href="#29">29</a></td></tr
><tr id="gr_svn4747_30"

><td id="30"><a href="#30">30</a></td></tr
><tr id="gr_svn4747_31"

><td id="31"><a href="#31">31</a></td></tr
><tr id="gr_svn4747_32"

><td id="32"><a href="#32">32</a></td></tr
><tr id="gr_svn4747_33"

><td id="33"><a href="#33">33</a></td></tr
><tr id="gr_svn4747_34"

><td id="34"><a href="#34">34</a></td></tr
><tr id="gr_svn4747_35"

><td id="35"><a href="#35">35</a></td></tr
><tr id="gr_svn4747_36"

><td id="36"><a href="#36">36</a></td></tr
><tr id="gr_svn4747_37"

><td id="37"><a href="#37">37</a></td></tr
><tr id="gr_svn4747_38"

><td id="38"><a href="#38">38</a></td></tr
><tr id="gr_svn4747_39"

><td id="39"><a href="#39">39</a></td></tr
><tr id="gr_svn4747_40"

><td id="40"><a href="#40">40</a></td></tr
><tr id="gr_svn4747_41"

><td id="41"><a href="#41">41</a></td></tr
><tr id="gr_svn4747_42"

><td id="42"><a href="#42">42</a></td></tr
><tr id="gr_svn4747_43"

><td id="43"><a href="#43">43</a></td></tr
><tr id="gr_svn4747_44"

><td id="44"><a href="#44">44</a></td></tr
><tr id="gr_svn4747_45"

><td id="45"><a href="#45">45</a></td></tr
><tr id="gr_svn4747_46"

><td id="46"><a href="#46">46</a></td></tr
><tr id="gr_svn4747_47"

><td id="47"><a href="#47">47</a></td></tr
><tr id="gr_svn4747_48"

><td id="48"><a href="#48">48</a></td></tr
><tr id="gr_svn4747_49"

><td id="49"><a href="#49">49</a></td></tr
><tr id="gr_svn4747_50"

><td id="50"><a href="#50">50</a></td></tr
><tr id="gr_svn4747_51"

><td id="51"><a href="#51">51</a></td></tr
><tr id="gr_svn4747_52"

><td id="52"><a href="#52">52</a></td></tr
><tr id="gr_svn4747_53"

><td id="53"><a href="#53">53</a></td></tr
><tr id="gr_svn4747_54"

><td id="54"><a href="#54">54</a></td></tr
><tr id="gr_svn4747_55"

><td id="55"><a href="#55">55</a></td></tr
><tr id="gr_svn4747_56"

><td id="56"><a href="#56">56</a></td></tr
><tr id="gr_svn4747_57"

><td id="57"><a href="#57">57</a></td></tr
><tr id="gr_svn4747_58"

><td id="58"><a href="#58">58</a></td></tr
><tr id="gr_svn4747_59"

><td id="59"><a href="#59">59</a></td></tr
><tr id="gr_svn4747_60"

><td id="60"><a href="#60">60</a></td></tr
><tr id="gr_svn4747_61"

><td id="61"><a href="#61">61</a></td></tr
><tr id="gr_svn4747_62"

><td id="62"><a href="#62">62</a></td></tr
><tr id="gr_svn4747_63"

><td id="63"><a href="#63">63</a></td></tr
><tr id="gr_svn4747_64"

><td id="64"><a href="#64">64</a></td></tr
><tr id="gr_svn4747_65"

><td id="65"><a href="#65">65</a></td></tr
><tr id="gr_svn4747_66"

><td id="66"><a href="#66">66</a></td></tr
><tr id="gr_svn4747_67"

><td id="67"><a href="#67">67</a></td></tr
><tr id="gr_svn4747_68"

><td id="68"><a href="#68">68</a></td></tr
><tr id="gr_svn4747_69"

><td id="69"><a href="#69">69</a></td></tr
><tr id="gr_svn4747_70"

><td id="70"><a href="#70">70</a></td></tr
><tr id="gr_svn4747_71"

><td id="71"><a href="#71">71</a></td></tr
><tr id="gr_svn4747_72"

><td id="72"><a href="#72">72</a></td></tr
><tr id="gr_svn4747_73"

><td id="73"><a href="#73">73</a></td></tr
><tr id="gr_svn4747_74"

><td id="74"><a href="#74">74</a></td></tr
><tr id="gr_svn4747_75"

><td id="75"><a href="#75">75</a></td></tr
><tr id="gr_svn4747_76"

><td id="76"><a href="#76">76</a></td></tr
><tr id="gr_svn4747_77"

><td id="77"><a href="#77">77</a></td></tr
><tr id="gr_svn4747_78"

><td id="78"><a href="#78">78</a></td></tr
><tr id="gr_svn4747_79"

><td id="79"><a href="#79">79</a></td></tr
><tr id="gr_svn4747_80"

><td id="80"><a href="#80">80</a></td></tr
><tr id="gr_svn4747_81"

><td id="81"><a href="#81">81</a></td></tr
><tr id="gr_svn4747_82"

><td id="82"><a href="#82">82</a></td></tr
><tr id="gr_svn4747_83"

><td id="83"><a href="#83">83</a></td></tr
><tr id="gr_svn4747_84"

><td id="84"><a href="#84">84</a></td></tr
><tr id="gr_svn4747_85"

><td id="85"><a href="#85">85</a></td></tr
><tr id="gr_svn4747_86"

><td id="86"><a href="#86">86</a></td></tr
><tr id="gr_svn4747_87"

><td id="87"><a href="#87">87</a></td></tr
><tr id="gr_svn4747_88"

><td id="88"><a href="#88">88</a></td></tr
><tr id="gr_svn4747_89"

><td id="89"><a href="#89">89</a></td></tr
><tr id="gr_svn4747_90"

><td id="90"><a href="#90">90</a></td></tr
><tr id="gr_svn4747_91"

><td id="91"><a href="#91">91</a></td></tr
><tr id="gr_svn4747_92"

><td id="92"><a href="#92">92</a></td></tr
><tr id="gr_svn4747_93"

><td id="93"><a href="#93">93</a></td></tr
><tr id="gr_svn4747_94"

><td id="94"><a href="#94">94</a></td></tr
><tr id="gr_svn4747_95"

><td id="95"><a href="#95">95</a></td></tr
><tr id="gr_svn4747_96"

><td id="96"><a href="#96">96</a></td></tr
><tr id="gr_svn4747_97"

><td id="97"><a href="#97">97</a></td></tr
><tr id="gr_svn4747_98"

><td id="98"><a href="#98">98</a></td></tr
><tr id="gr_svn4747_99"

><td id="99"><a href="#99">99</a></td></tr
><tr id="gr_svn4747_100"

><td id="100"><a href="#100">100</a></td></tr
><tr id="gr_svn4747_101"

><td id="101"><a href="#101">101</a></td></tr
><tr id="gr_svn4747_102"

><td id="102"><a href="#102">102</a></td></tr
><tr id="gr_svn4747_103"

><td id="103"><a href="#103">103</a></td></tr
><tr id="gr_svn4747_104"

><td id="104"><a href="#104">104</a></td></tr
><tr id="gr_svn4747_105"

><td id="105"><a href="#105">105</a></td></tr
><tr id="gr_svn4747_106"

><td id="106"><a href="#106">106</a></td></tr
><tr id="gr_svn4747_107"

><td id="107"><a href="#107">107</a></td></tr
><tr id="gr_svn4747_108"

><td id="108"><a href="#108">108</a></td></tr
><tr id="gr_svn4747_109"

><td id="109"><a href="#109">109</a></td></tr
><tr id="gr_svn4747_110"

><td id="110"><a href="#110">110</a></td></tr
><tr id="gr_svn4747_111"

><td id="111"><a href="#111">111</a></td></tr
><tr id="gr_svn4747_112"

><td id="112"><a href="#112">112</a></td></tr
><tr id="gr_svn4747_113"

><td id="113"><a href="#113">113</a></td></tr
><tr id="gr_svn4747_114"

><td id="114"><a href="#114">114</a></td></tr
><tr id="gr_svn4747_115"

><td id="115"><a href="#115">115</a></td></tr
><tr id="gr_svn4747_116"

><td id="116"><a href="#116">116</a></td></tr
><tr id="gr_svn4747_117"

><td id="117"><a href="#117">117</a></td></tr
><tr id="gr_svn4747_118"

><td id="118"><a href="#118">118</a></td></tr
><tr id="gr_svn4747_119"

><td id="119"><a href="#119">119</a></td></tr
><tr id="gr_svn4747_120"

><td id="120"><a href="#120">120</a></td></tr
><tr id="gr_svn4747_121"

><td id="121"><a href="#121">121</a></td></tr
><tr id="gr_svn4747_122"

><td id="122"><a href="#122">122</a></td></tr
><tr id="gr_svn4747_123"

><td id="123"><a href="#123">123</a></td></tr
><tr id="gr_svn4747_124"

><td id="124"><a href="#124">124</a></td></tr
><tr id="gr_svn4747_125"

><td id="125"><a href="#125">125</a></td></tr
><tr id="gr_svn4747_126"

><td id="126"><a href="#126">126</a></td></tr
><tr id="gr_svn4747_127"

><td id="127"><a href="#127">127</a></td></tr
><tr id="gr_svn4747_128"

><td id="128"><a href="#128">128</a></td></tr
><tr id="gr_svn4747_129"

><td id="129"><a href="#129">129</a></td></tr
><tr id="gr_svn4747_130"

><td id="130"><a href="#130">130</a></td></tr
><tr id="gr_svn4747_131"

><td id="131"><a href="#131">131</a></td></tr
><tr id="gr_svn4747_132"

><td id="132"><a href="#132">132</a></td></tr
><tr id="gr_svn4747_133"

><td id="133"><a href="#133">133</a></td></tr
><tr id="gr_svn4747_134"

><td id="134"><a href="#134">134</a></td></tr
><tr id="gr_svn4747_135"

><td id="135"><a href="#135">135</a></td></tr
><tr id="gr_svn4747_136"

><td id="136"><a href="#136">136</a></td></tr
><tr id="gr_svn4747_137"

><td id="137"><a href="#137">137</a></td></tr
><tr id="gr_svn4747_138"

><td id="138"><a href="#138">138</a></td></tr
><tr id="gr_svn4747_139"

><td id="139"><a href="#139">139</a></td></tr
><tr id="gr_svn4747_140"

><td id="140"><a href="#140">140</a></td></tr
><tr id="gr_svn4747_141"

><td id="141"><a href="#141">141</a></td></tr
><tr id="gr_svn4747_142"

><td id="142"><a href="#142">142</a></td></tr
><tr id="gr_svn4747_143"

><td id="143"><a href="#143">143</a></td></tr
><tr id="gr_svn4747_144"

><td id="144"><a href="#144">144</a></td></tr
><tr id="gr_svn4747_145"

><td id="145"><a href="#145">145</a></td></tr
><tr id="gr_svn4747_146"

><td id="146"><a href="#146">146</a></td></tr
><tr id="gr_svn4747_147"

><td id="147"><a href="#147">147</a></td></tr
><tr id="gr_svn4747_148"

><td id="148"><a href="#148">148</a></td></tr
><tr id="gr_svn4747_149"

><td id="149"><a href="#149">149</a></td></tr
><tr id="gr_svn4747_150"

><td id="150"><a href="#150">150</a></td></tr
><tr id="gr_svn4747_151"

><td id="151"><a href="#151">151</a></td></tr
><tr id="gr_svn4747_152"

><td id="152"><a href="#152">152</a></td></tr
><tr id="gr_svn4747_153"

><td id="153"><a href="#153">153</a></td></tr
><tr id="gr_svn4747_154"

><td id="154"><a href="#154">154</a></td></tr
><tr id="gr_svn4747_155"

><td id="155"><a href="#155">155</a></td></tr
><tr id="gr_svn4747_156"

><td id="156"><a href="#156">156</a></td></tr
><tr id="gr_svn4747_157"

><td id="157"><a href="#157">157</a></td></tr
><tr id="gr_svn4747_158"

><td id="158"><a href="#158">158</a></td></tr
><tr id="gr_svn4747_159"

><td id="159"><a href="#159">159</a></td></tr
><tr id="gr_svn4747_160"

><td id="160"><a href="#160">160</a></td></tr
><tr id="gr_svn4747_161"

><td id="161"><a href="#161">161</a></td></tr
><tr id="gr_svn4747_162"

><td id="162"><a href="#162">162</a></td></tr
><tr id="gr_svn4747_163"

><td id="163"><a href="#163">163</a></td></tr
><tr id="gr_svn4747_164"

><td id="164"><a href="#164">164</a></td></tr
><tr id="gr_svn4747_165"

><td id="165"><a href="#165">165</a></td></tr
><tr id="gr_svn4747_166"

><td id="166"><a href="#166">166</a></td></tr
><tr id="gr_svn4747_167"

><td id="167"><a href="#167">167</a></td></tr
><tr id="gr_svn4747_168"

><td id="168"><a href="#168">168</a></td></tr
><tr id="gr_svn4747_169"

><td id="169"><a href="#169">169</a></td></tr
><tr id="gr_svn4747_170"

><td id="170"><a href="#170">170</a></td></tr
><tr id="gr_svn4747_171"

><td id="171"><a href="#171">171</a></td></tr
><tr id="gr_svn4747_172"

><td id="172"><a href="#172">172</a></td></tr
><tr id="gr_svn4747_173"

><td id="173"><a href="#173">173</a></td></tr
><tr id="gr_svn4747_174"

><td id="174"><a href="#174">174</a></td></tr
><tr id="gr_svn4747_175"

><td id="175"><a href="#175">175</a></td></tr
><tr id="gr_svn4747_176"

><td id="176"><a href="#176">176</a></td></tr
><tr id="gr_svn4747_177"

><td id="177"><a href="#177">177</a></td></tr
><tr id="gr_svn4747_178"

><td id="178"><a href="#178">178</a></td></tr
><tr id="gr_svn4747_179"

><td id="179"><a href="#179">179</a></td></tr
><tr id="gr_svn4747_180"

><td id="180"><a href="#180">180</a></td></tr
><tr id="gr_svn4747_181"

><td id="181"><a href="#181">181</a></td></tr
><tr id="gr_svn4747_182"

><td id="182"><a href="#182">182</a></td></tr
><tr id="gr_svn4747_183"

><td id="183"><a href="#183">183</a></td></tr
><tr id="gr_svn4747_184"

><td id="184"><a href="#184">184</a></td></tr
><tr id="gr_svn4747_185"

><td id="185"><a href="#185">185</a></td></tr
><tr id="gr_svn4747_186"

><td id="186"><a href="#186">186</a></td></tr
><tr id="gr_svn4747_187"

><td id="187"><a href="#187">187</a></td></tr
><tr id="gr_svn4747_188"

><td id="188"><a href="#188">188</a></td></tr
><tr id="gr_svn4747_189"

><td id="189"><a href="#189">189</a></td></tr
><tr id="gr_svn4747_190"

><td id="190"><a href="#190">190</a></td></tr
><tr id="gr_svn4747_191"

><td id="191"><a href="#191">191</a></td></tr
><tr id="gr_svn4747_192"

><td id="192"><a href="#192">192</a></td></tr
><tr id="gr_svn4747_193"

><td id="193"><a href="#193">193</a></td></tr
><tr id="gr_svn4747_194"

><td id="194"><a href="#194">194</a></td></tr
><tr id="gr_svn4747_195"

><td id="195"><a href="#195">195</a></td></tr
><tr id="gr_svn4747_196"

><td id="196"><a href="#196">196</a></td></tr
><tr id="gr_svn4747_197"

><td id="197"><a href="#197">197</a></td></tr
><tr id="gr_svn4747_198"

><td id="198"><a href="#198">198</a></td></tr
><tr id="gr_svn4747_199"

><td id="199"><a href="#199">199</a></td></tr
><tr id="gr_svn4747_200"

><td id="200"><a href="#200">200</a></td></tr
><tr id="gr_svn4747_201"

><td id="201"><a href="#201">201</a></td></tr
><tr id="gr_svn4747_202"

><td id="202"><a href="#202">202</a></td></tr
><tr id="gr_svn4747_203"

><td id="203"><a href="#203">203</a></td></tr
><tr id="gr_svn4747_204"

><td id="204"><a href="#204">204</a></td></tr
><tr id="gr_svn4747_205"

><td id="205"><a href="#205">205</a></td></tr
><tr id="gr_svn4747_206"

><td id="206"><a href="#206">206</a></td></tr
><tr id="gr_svn4747_207"

><td id="207"><a href="#207">207</a></td></tr
><tr id="gr_svn4747_208"

><td id="208"><a href="#208">208</a></td></tr
><tr id="gr_svn4747_209"

><td id="209"><a href="#209">209</a></td></tr
><tr id="gr_svn4747_210"

><td id="210"><a href="#210">210</a></td></tr
><tr id="gr_svn4747_211"

><td id="211"><a href="#211">211</a></td></tr
><tr id="gr_svn4747_212"

><td id="212"><a href="#212">212</a></td></tr
><tr id="gr_svn4747_213"

><td id="213"><a href="#213">213</a></td></tr
><tr id="gr_svn4747_214"

><td id="214"><a href="#214">214</a></td></tr
><tr id="gr_svn4747_215"

><td id="215"><a href="#215">215</a></td></tr
><tr id="gr_svn4747_216"

><td id="216"><a href="#216">216</a></td></tr
><tr id="gr_svn4747_217"

><td id="217"><a href="#217">217</a></td></tr
><tr id="gr_svn4747_218"

><td id="218"><a href="#218">218</a></td></tr
><tr id="gr_svn4747_219"

><td id="219"><a href="#219">219</a></td></tr
><tr id="gr_svn4747_220"

><td id="220"><a href="#220">220</a></td></tr
><tr id="gr_svn4747_221"

><td id="221"><a href="#221">221</a></td></tr
><tr id="gr_svn4747_222"

><td id="222"><a href="#222">222</a></td></tr
><tr id="gr_svn4747_223"

><td id="223"><a href="#223">223</a></td></tr
><tr id="gr_svn4747_224"

><td id="224"><a href="#224">224</a></td></tr
><tr id="gr_svn4747_225"

><td id="225"><a href="#225">225</a></td></tr
><tr id="gr_svn4747_226"

><td id="226"><a href="#226">226</a></td></tr
><tr id="gr_svn4747_227"

><td id="227"><a href="#227">227</a></td></tr
><tr id="gr_svn4747_228"

><td id="228"><a href="#228">228</a></td></tr
><tr id="gr_svn4747_229"

><td id="229"><a href="#229">229</a></td></tr
><tr id="gr_svn4747_230"

><td id="230"><a href="#230">230</a></td></tr
><tr id="gr_svn4747_231"

><td id="231"><a href="#231">231</a></td></tr
><tr id="gr_svn4747_232"

><td id="232"><a href="#232">232</a></td></tr
><tr id="gr_svn4747_233"

><td id="233"><a href="#233">233</a></td></tr
><tr id="gr_svn4747_234"

><td id="234"><a href="#234">234</a></td></tr
><tr id="gr_svn4747_235"

><td id="235"><a href="#235">235</a></td></tr
><tr id="gr_svn4747_236"

><td id="236"><a href="#236">236</a></td></tr
><tr id="gr_svn4747_237"

><td id="237"><a href="#237">237</a></td></tr
><tr id="gr_svn4747_238"

><td id="238"><a href="#238">238</a></td></tr
><tr id="gr_svn4747_239"

><td id="239"><a href="#239">239</a></td></tr
><tr id="gr_svn4747_240"

><td id="240"><a href="#240">240</a></td></tr
><tr id="gr_svn4747_241"

><td id="241"><a href="#241">241</a></td></tr
><tr id="gr_svn4747_242"

><td id="242"><a href="#242">242</a></td></tr
><tr id="gr_svn4747_243"

><td id="243"><a href="#243">243</a></td></tr
><tr id="gr_svn4747_244"

><td id="244"><a href="#244">244</a></td></tr
><tr id="gr_svn4747_245"

><td id="245"><a href="#245">245</a></td></tr
><tr id="gr_svn4747_246"

><td id="246"><a href="#246">246</a></td></tr
><tr id="gr_svn4747_247"

><td id="247"><a href="#247">247</a></td></tr
><tr id="gr_svn4747_248"

><td id="248"><a href="#248">248</a></td></tr
><tr id="gr_svn4747_249"

><td id="249"><a href="#249">249</a></td></tr
><tr id="gr_svn4747_250"

><td id="250"><a href="#250">250</a></td></tr
><tr id="gr_svn4747_251"

><td id="251"><a href="#251">251</a></td></tr
><tr id="gr_svn4747_252"

><td id="252"><a href="#252">252</a></td></tr
><tr id="gr_svn4747_253"

><td id="253"><a href="#253">253</a></td></tr
><tr id="gr_svn4747_254"

><td id="254"><a href="#254">254</a></td></tr
><tr id="gr_svn4747_255"

><td id="255"><a href="#255">255</a></td></tr
><tr id="gr_svn4747_256"

><td id="256"><a href="#256">256</a></td></tr
><tr id="gr_svn4747_257"

><td id="257"><a href="#257">257</a></td></tr
><tr id="gr_svn4747_258"

><td id="258"><a href="#258">258</a></td></tr
><tr id="gr_svn4747_259"

><td id="259"><a href="#259">259</a></td></tr
><tr id="gr_svn4747_260"

><td id="260"><a href="#260">260</a></td></tr
><tr id="gr_svn4747_261"

><td id="261"><a href="#261">261</a></td></tr
><tr id="gr_svn4747_262"

><td id="262"><a href="#262">262</a></td></tr
><tr id="gr_svn4747_263"

><td id="263"><a href="#263">263</a></td></tr
><tr id="gr_svn4747_264"

><td id="264"><a href="#264">264</a></td></tr
><tr id="gr_svn4747_265"

><td id="265"><a href="#265">265</a></td></tr
><tr id="gr_svn4747_266"

><td id="266"><a href="#266">266</a></td></tr
><tr id="gr_svn4747_267"

><td id="267"><a href="#267">267</a></td></tr
><tr id="gr_svn4747_268"

><td id="268"><a href="#268">268</a></td></tr
><tr id="gr_svn4747_269"

><td id="269"><a href="#269">269</a></td></tr
><tr id="gr_svn4747_270"

><td id="270"><a href="#270">270</a></td></tr
><tr id="gr_svn4747_271"

><td id="271"><a href="#271">271</a></td></tr
><tr id="gr_svn4747_272"

><td id="272"><a href="#272">272</a></td></tr
><tr id="gr_svn4747_273"

><td id="273"><a href="#273">273</a></td></tr
><tr id="gr_svn4747_274"

><td id="274"><a href="#274">274</a></td></tr
><tr id="gr_svn4747_275"

><td id="275"><a href="#275">275</a></td></tr
><tr id="gr_svn4747_276"

><td id="276"><a href="#276">276</a></td></tr
><tr id="gr_svn4747_277"

><td id="277"><a href="#277">277</a></td></tr
><tr id="gr_svn4747_278"

><td id="278"><a href="#278">278</a></td></tr
><tr id="gr_svn4747_279"

><td id="279"><a href="#279">279</a></td></tr
><tr id="gr_svn4747_280"

><td id="280"><a href="#280">280</a></td></tr
><tr id="gr_svn4747_281"

><td id="281"><a href="#281">281</a></td></tr
><tr id="gr_svn4747_282"

><td id="282"><a href="#282">282</a></td></tr
><tr id="gr_svn4747_283"

><td id="283"><a href="#283">283</a></td></tr
><tr id="gr_svn4747_284"

><td id="284"><a href="#284">284</a></td></tr
><tr id="gr_svn4747_285"

><td id="285"><a href="#285">285</a></td></tr
><tr id="gr_svn4747_286"

><td id="286"><a href="#286">286</a></td></tr
><tr id="gr_svn4747_287"

><td id="287"><a href="#287">287</a></td></tr
><tr id="gr_svn4747_288"

><td id="288"><a href="#288">288</a></td></tr
><tr id="gr_svn4747_289"

><td id="289"><a href="#289">289</a></td></tr
><tr id="gr_svn4747_290"

><td id="290"><a href="#290">290</a></td></tr
><tr id="gr_svn4747_291"

><td id="291"><a href="#291">291</a></td></tr
><tr id="gr_svn4747_292"

><td id="292"><a href="#292">292</a></td></tr
><tr id="gr_svn4747_293"

><td id="293"><a href="#293">293</a></td></tr
><tr id="gr_svn4747_294"

><td id="294"><a href="#294">294</a></td></tr
><tr id="gr_svn4747_295"

><td id="295"><a href="#295">295</a></td></tr
><tr id="gr_svn4747_296"

><td id="296"><a href="#296">296</a></td></tr
><tr id="gr_svn4747_297"

><td id="297"><a href="#297">297</a></td></tr
><tr id="gr_svn4747_298"

><td id="298"><a href="#298">298</a></td></tr
><tr id="gr_svn4747_299"

><td id="299"><a href="#299">299</a></td></tr
><tr id="gr_svn4747_300"

><td id="300"><a href="#300">300</a></td></tr
><tr id="gr_svn4747_301"

><td id="301"><a href="#301">301</a></td></tr
><tr id="gr_svn4747_302"

><td id="302"><a href="#302">302</a></td></tr
><tr id="gr_svn4747_303"

><td id="303"><a href="#303">303</a></td></tr
><tr id="gr_svn4747_304"

><td id="304"><a href="#304">304</a></td></tr
><tr id="gr_svn4747_305"

><td id="305"><a href="#305">305</a></td></tr
><tr id="gr_svn4747_306"

><td id="306"><a href="#306">306</a></td></tr
><tr id="gr_svn4747_307"

><td id="307"><a href="#307">307</a></td></tr
><tr id="gr_svn4747_308"

><td id="308"><a href="#308">308</a></td></tr
><tr id="gr_svn4747_309"

><td id="309"><a href="#309">309</a></td></tr
><tr id="gr_svn4747_310"

><td id="310"><a href="#310">310</a></td></tr
><tr id="gr_svn4747_311"

><td id="311"><a href="#311">311</a></td></tr
><tr id="gr_svn4747_312"

><td id="312"><a href="#312">312</a></td></tr
><tr id="gr_svn4747_313"

><td id="313"><a href="#313">313</a></td></tr
><tr id="gr_svn4747_314"

><td id="314"><a href="#314">314</a></td></tr
><tr id="gr_svn4747_315"

><td id="315"><a href="#315">315</a></td></tr
><tr id="gr_svn4747_316"

><td id="316"><a href="#316">316</a></td></tr
><tr id="gr_svn4747_317"

><td id="317"><a href="#317">317</a></td></tr
><tr id="gr_svn4747_318"

><td id="318"><a href="#318">318</a></td></tr
><tr id="gr_svn4747_319"

><td id="319"><a href="#319">319</a></td></tr
><tr id="gr_svn4747_320"

><td id="320"><a href="#320">320</a></td></tr
><tr id="gr_svn4747_321"

><td id="321"><a href="#321">321</a></td></tr
><tr id="gr_svn4747_322"

><td id="322"><a href="#322">322</a></td></tr
><tr id="gr_svn4747_323"

><td id="323"><a href="#323">323</a></td></tr
><tr id="gr_svn4747_324"

><td id="324"><a href="#324">324</a></td></tr
><tr id="gr_svn4747_325"

><td id="325"><a href="#325">325</a></td></tr
><tr id="gr_svn4747_326"

><td id="326"><a href="#326">326</a></td></tr
><tr id="gr_svn4747_327"

><td id="327"><a href="#327">327</a></td></tr
><tr id="gr_svn4747_328"

><td id="328"><a href="#328">328</a></td></tr
><tr id="gr_svn4747_329"

><td id="329"><a href="#329">329</a></td></tr
><tr id="gr_svn4747_330"

><td id="330"><a href="#330">330</a></td></tr
><tr id="gr_svn4747_331"

><td id="331"><a href="#331">331</a></td></tr
><tr id="gr_svn4747_332"

><td id="332"><a href="#332">332</a></td></tr
><tr id="gr_svn4747_333"

><td id="333"><a href="#333">333</a></td></tr
><tr id="gr_svn4747_334"

><td id="334"><a href="#334">334</a></td></tr
><tr id="gr_svn4747_335"

><td id="335"><a href="#335">335</a></td></tr
><tr id="gr_svn4747_336"

><td id="336"><a href="#336">336</a></td></tr
><tr id="gr_svn4747_337"

><td id="337"><a href="#337">337</a></td></tr
><tr id="gr_svn4747_338"

><td id="338"><a href="#338">338</a></td></tr
><tr id="gr_svn4747_339"

><td id="339"><a href="#339">339</a></td></tr
><tr id="gr_svn4747_340"

><td id="340"><a href="#340">340</a></td></tr
><tr id="gr_svn4747_341"

><td id="341"><a href="#341">341</a></td></tr
><tr id="gr_svn4747_342"

><td id="342"><a href="#342">342</a></td></tr
><tr id="gr_svn4747_343"

><td id="343"><a href="#343">343</a></td></tr
><tr id="gr_svn4747_344"

><td id="344"><a href="#344">344</a></td></tr
><tr id="gr_svn4747_345"

><td id="345"><a href="#345">345</a></td></tr
><tr id="gr_svn4747_346"

><td id="346"><a href="#346">346</a></td></tr
><tr id="gr_svn4747_347"

><td id="347"><a href="#347">347</a></td></tr
><tr id="gr_svn4747_348"

><td id="348"><a href="#348">348</a></td></tr
><tr id="gr_svn4747_349"

><td id="349"><a href="#349">349</a></td></tr
><tr id="gr_svn4747_350"

><td id="350"><a href="#350">350</a></td></tr
><tr id="gr_svn4747_351"

><td id="351"><a href="#351">351</a></td></tr
><tr id="gr_svn4747_352"

><td id="352"><a href="#352">352</a></td></tr
><tr id="gr_svn4747_353"

><td id="353"><a href="#353">353</a></td></tr
><tr id="gr_svn4747_354"

><td id="354"><a href="#354">354</a></td></tr
><tr id="gr_svn4747_355"

><td id="355"><a href="#355">355</a></td></tr
><tr id="gr_svn4747_356"

><td id="356"><a href="#356">356</a></td></tr
><tr id="gr_svn4747_357"

><td id="357"><a href="#357">357</a></td></tr
><tr id="gr_svn4747_358"

><td id="358"><a href="#358">358</a></td></tr
><tr id="gr_svn4747_359"

><td id="359"><a href="#359">359</a></td></tr
><tr id="gr_svn4747_360"

><td id="360"><a href="#360">360</a></td></tr
><tr id="gr_svn4747_361"

><td id="361"><a href="#361">361</a></td></tr
><tr id="gr_svn4747_362"

><td id="362"><a href="#362">362</a></td></tr
><tr id="gr_svn4747_363"

><td id="363"><a href="#363">363</a></td></tr
><tr id="gr_svn4747_364"

><td id="364"><a href="#364">364</a></td></tr
><tr id="gr_svn4747_365"

><td id="365"><a href="#365">365</a></td></tr
><tr id="gr_svn4747_366"

><td id="366"><a href="#366">366</a></td></tr
><tr id="gr_svn4747_367"

><td id="367"><a href="#367">367</a></td></tr
><tr id="gr_svn4747_368"

><td id="368"><a href="#368">368</a></td></tr
><tr id="gr_svn4747_369"

><td id="369"><a href="#369">369</a></td></tr
><tr id="gr_svn4747_370"

><td id="370"><a href="#370">370</a></td></tr
><tr id="gr_svn4747_371"

><td id="371"><a href="#371">371</a></td></tr
><tr id="gr_svn4747_372"

><td id="372"><a href="#372">372</a></td></tr
><tr id="gr_svn4747_373"

><td id="373"><a href="#373">373</a></td></tr
><tr id="gr_svn4747_374"

><td id="374"><a href="#374">374</a></td></tr
><tr id="gr_svn4747_375"

><td id="375"><a href="#375">375</a></td></tr
><tr id="gr_svn4747_376"

><td id="376"><a href="#376">376</a></td></tr
><tr id="gr_svn4747_377"

><td id="377"><a href="#377">377</a></td></tr
><tr id="gr_svn4747_378"

><td id="378"><a href="#378">378</a></td></tr
><tr id="gr_svn4747_379"

><td id="379"><a href="#379">379</a></td></tr
><tr id="gr_svn4747_380"

><td id="380"><a href="#380">380</a></td></tr
><tr id="gr_svn4747_381"

><td id="381"><a href="#381">381</a></td></tr
><tr id="gr_svn4747_382"

><td id="382"><a href="#382">382</a></td></tr
><tr id="gr_svn4747_383"

><td id="383"><a href="#383">383</a></td></tr
><tr id="gr_svn4747_384"

><td id="384"><a href="#384">384</a></td></tr
><tr id="gr_svn4747_385"

><td id="385"><a href="#385">385</a></td></tr
><tr id="gr_svn4747_386"

><td id="386"><a href="#386">386</a></td></tr
><tr id="gr_svn4747_387"

><td id="387"><a href="#387">387</a></td></tr
><tr id="gr_svn4747_388"

><td id="388"><a href="#388">388</a></td></tr
><tr id="gr_svn4747_389"

><td id="389"><a href="#389">389</a></td></tr
><tr id="gr_svn4747_390"

><td id="390"><a href="#390">390</a></td></tr
><tr id="gr_svn4747_391"

><td id="391"><a href="#391">391</a></td></tr
><tr id="gr_svn4747_392"

><td id="392"><a href="#392">392</a></td></tr
><tr id="gr_svn4747_393"

><td id="393"><a href="#393">393</a></td></tr
><tr id="gr_svn4747_394"

><td id="394"><a href="#394">394</a></td></tr
><tr id="gr_svn4747_395"

><td id="395"><a href="#395">395</a></td></tr
><tr id="gr_svn4747_396"

><td id="396"><a href="#396">396</a></td></tr
><tr id="gr_svn4747_397"

><td id="397"><a href="#397">397</a></td></tr
><tr id="gr_svn4747_398"

><td id="398"><a href="#398">398</a></td></tr
><tr id="gr_svn4747_399"

><td id="399"><a href="#399">399</a></td></tr
><tr id="gr_svn4747_400"

><td id="400"><a href="#400">400</a></td></tr
><tr id="gr_svn4747_401"

><td id="401"><a href="#401">401</a></td></tr
><tr id="gr_svn4747_402"

><td id="402"><a href="#402">402</a></td></tr
><tr id="gr_svn4747_403"

><td id="403"><a href="#403">403</a></td></tr
><tr id="gr_svn4747_404"

><td id="404"><a href="#404">404</a></td></tr
><tr id="gr_svn4747_405"

><td id="405"><a href="#405">405</a></td></tr
><tr id="gr_svn4747_406"

><td id="406"><a href="#406">406</a></td></tr
><tr id="gr_svn4747_407"

><td id="407"><a href="#407">407</a></td></tr
><tr id="gr_svn4747_408"

><td id="408"><a href="#408">408</a></td></tr
><tr id="gr_svn4747_409"

><td id="409"><a href="#409">409</a></td></tr
><tr id="gr_svn4747_410"

><td id="410"><a href="#410">410</a></td></tr
><tr id="gr_svn4747_411"

><td id="411"><a href="#411">411</a></td></tr
><tr id="gr_svn4747_412"

><td id="412"><a href="#412">412</a></td></tr
><tr id="gr_svn4747_413"

><td id="413"><a href="#413">413</a></td></tr
><tr id="gr_svn4747_414"

><td id="414"><a href="#414">414</a></td></tr
><tr id="gr_svn4747_415"

><td id="415"><a href="#415">415</a></td></tr
><tr id="gr_svn4747_416"

><td id="416"><a href="#416">416</a></td></tr
><tr id="gr_svn4747_417"

><td id="417"><a href="#417">417</a></td></tr
><tr id="gr_svn4747_418"

><td id="418"><a href="#418">418</a></td></tr
><tr id="gr_svn4747_419"

><td id="419"><a href="#419">419</a></td></tr
><tr id="gr_svn4747_420"

><td id="420"><a href="#420">420</a></td></tr
><tr id="gr_svn4747_421"

><td id="421"><a href="#421">421</a></td></tr
><tr id="gr_svn4747_422"

><td id="422"><a href="#422">422</a></td></tr
><tr id="gr_svn4747_423"

><td id="423"><a href="#423">423</a></td></tr
><tr id="gr_svn4747_424"

><td id="424"><a href="#424">424</a></td></tr
><tr id="gr_svn4747_425"

><td id="425"><a href="#425">425</a></td></tr
><tr id="gr_svn4747_426"

><td id="426"><a href="#426">426</a></td></tr
><tr id="gr_svn4747_427"

><td id="427"><a href="#427">427</a></td></tr
><tr id="gr_svn4747_428"

><td id="428"><a href="#428">428</a></td></tr
><tr id="gr_svn4747_429"

><td id="429"><a href="#429">429</a></td></tr
><tr id="gr_svn4747_430"

><td id="430"><a href="#430">430</a></td></tr
><tr id="gr_svn4747_431"

><td id="431"><a href="#431">431</a></td></tr
><tr id="gr_svn4747_432"

><td id="432"><a href="#432">432</a></td></tr
><tr id="gr_svn4747_433"

><td id="433"><a href="#433">433</a></td></tr
><tr id="gr_svn4747_434"

><td id="434"><a href="#434">434</a></td></tr
><tr id="gr_svn4747_435"

><td id="435"><a href="#435">435</a></td></tr
><tr id="gr_svn4747_436"

><td id="436"><a href="#436">436</a></td></tr
><tr id="gr_svn4747_437"

><td id="437"><a href="#437">437</a></td></tr
><tr id="gr_svn4747_438"

><td id="438"><a href="#438">438</a></td></tr
><tr id="gr_svn4747_439"

><td id="439"><a href="#439">439</a></td></tr
><tr id="gr_svn4747_440"

><td id="440"><a href="#440">440</a></td></tr
><tr id="gr_svn4747_441"

><td id="441"><a href="#441">441</a></td></tr
><tr id="gr_svn4747_442"

><td id="442"><a href="#442">442</a></td></tr
><tr id="gr_svn4747_443"

><td id="443"><a href="#443">443</a></td></tr
><tr id="gr_svn4747_444"

><td id="444"><a href="#444">444</a></td></tr
><tr id="gr_svn4747_445"

><td id="445"><a href="#445">445</a></td></tr
><tr id="gr_svn4747_446"

><td id="446"><a href="#446">446</a></td></tr
><tr id="gr_svn4747_447"

><td id="447"><a href="#447">447</a></td></tr
><tr id="gr_svn4747_448"

><td id="448"><a href="#448">448</a></td></tr
><tr id="gr_svn4747_449"

><td id="449"><a href="#449">449</a></td></tr
><tr id="gr_svn4747_450"

><td id="450"><a href="#450">450</a></td></tr
><tr id="gr_svn4747_451"

><td id="451"><a href="#451">451</a></td></tr
><tr id="gr_svn4747_452"

><td id="452"><a href="#452">452</a></td></tr
><tr id="gr_svn4747_453"

><td id="453"><a href="#453">453</a></td></tr
><tr id="gr_svn4747_454"

><td id="454"><a href="#454">454</a></td></tr
><tr id="gr_svn4747_455"

><td id="455"><a href="#455">455</a></td></tr
><tr id="gr_svn4747_456"

><td id="456"><a href="#456">456</a></td></tr
><tr id="gr_svn4747_457"

><td id="457"><a href="#457">457</a></td></tr
><tr id="gr_svn4747_458"

><td id="458"><a href="#458">458</a></td></tr
><tr id="gr_svn4747_459"

><td id="459"><a href="#459">459</a></td></tr
><tr id="gr_svn4747_460"

><td id="460"><a href="#460">460</a></td></tr
><tr id="gr_svn4747_461"

><td id="461"><a href="#461">461</a></td></tr
><tr id="gr_svn4747_462"

><td id="462"><a href="#462">462</a></td></tr
><tr id="gr_svn4747_463"

><td id="463"><a href="#463">463</a></td></tr
><tr id="gr_svn4747_464"

><td id="464"><a href="#464">464</a></td></tr
><tr id="gr_svn4747_465"

><td id="465"><a href="#465">465</a></td></tr
><tr id="gr_svn4747_466"

><td id="466"><a href="#466">466</a></td></tr
><tr id="gr_svn4747_467"

><td id="467"><a href="#467">467</a></td></tr
><tr id="gr_svn4747_468"

><td id="468"><a href="#468">468</a></td></tr
><tr id="gr_svn4747_469"

><td id="469"><a href="#469">469</a></td></tr
><tr id="gr_svn4747_470"

><td id="470"><a href="#470">470</a></td></tr
><tr id="gr_svn4747_471"

><td id="471"><a href="#471">471</a></td></tr
><tr id="gr_svn4747_472"

><td id="472"><a href="#472">472</a></td></tr
><tr id="gr_svn4747_473"

><td id="473"><a href="#473">473</a></td></tr
><tr id="gr_svn4747_474"

><td id="474"><a href="#474">474</a></td></tr
><tr id="gr_svn4747_475"

><td id="475"><a href="#475">475</a></td></tr
><tr id="gr_svn4747_476"

><td id="476"><a href="#476">476</a></td></tr
><tr id="gr_svn4747_477"

><td id="477"><a href="#477">477</a></td></tr
><tr id="gr_svn4747_478"

><td id="478"><a href="#478">478</a></td></tr
><tr id="gr_svn4747_479"

><td id="479"><a href="#479">479</a></td></tr
><tr id="gr_svn4747_480"

><td id="480"><a href="#480">480</a></td></tr
><tr id="gr_svn4747_481"

><td id="481"><a href="#481">481</a></td></tr
><tr id="gr_svn4747_482"

><td id="482"><a href="#482">482</a></td></tr
><tr id="gr_svn4747_483"

><td id="483"><a href="#483">483</a></td></tr
><tr id="gr_svn4747_484"

><td id="484"><a href="#484">484</a></td></tr
><tr id="gr_svn4747_485"

><td id="485"><a href="#485">485</a></td></tr
><tr id="gr_svn4747_486"

><td id="486"><a href="#486">486</a></td></tr
><tr id="gr_svn4747_487"

><td id="487"><a href="#487">487</a></td></tr
><tr id="gr_svn4747_488"

><td id="488"><a href="#488">488</a></td></tr
><tr id="gr_svn4747_489"

><td id="489"><a href="#489">489</a></td></tr
><tr id="gr_svn4747_490"

><td id="490"><a href="#490">490</a></td></tr
><tr id="gr_svn4747_491"

><td id="491"><a href="#491">491</a></td></tr
><tr id="gr_svn4747_492"

><td id="492"><a href="#492">492</a></td></tr
><tr id="gr_svn4747_493"

><td id="493"><a href="#493">493</a></td></tr
><tr id="gr_svn4747_494"

><td id="494"><a href="#494">494</a></td></tr
><tr id="gr_svn4747_495"

><td id="495"><a href="#495">495</a></td></tr
><tr id="gr_svn4747_496"

><td id="496"><a href="#496">496</a></td></tr
><tr id="gr_svn4747_497"

><td id="497"><a href="#497">497</a></td></tr
><tr id="gr_svn4747_498"

><td id="498"><a href="#498">498</a></td></tr
><tr id="gr_svn4747_499"

><td id="499"><a href="#499">499</a></td></tr
><tr id="gr_svn4747_500"

><td id="500"><a href="#500">500</a></td></tr
><tr id="gr_svn4747_501"

><td id="501"><a href="#501">501</a></td></tr
><tr id="gr_svn4747_502"

><td id="502"><a href="#502">502</a></td></tr
><tr id="gr_svn4747_503"

><td id="503"><a href="#503">503</a></td></tr
><tr id="gr_svn4747_504"

><td id="504"><a href="#504">504</a></td></tr
><tr id="gr_svn4747_505"

><td id="505"><a href="#505">505</a></td></tr
><tr id="gr_svn4747_506"

><td id="506"><a href="#506">506</a></td></tr
><tr id="gr_svn4747_507"

><td id="507"><a href="#507">507</a></td></tr
><tr id="gr_svn4747_508"

><td id="508"><a href="#508">508</a></td></tr
><tr id="gr_svn4747_509"

><td id="509"><a href="#509">509</a></td></tr
><tr id="gr_svn4747_510"

><td id="510"><a href="#510">510</a></td></tr
><tr id="gr_svn4747_511"

><td id="511"><a href="#511">511</a></td></tr
><tr id="gr_svn4747_512"

><td id="512"><a href="#512">512</a></td></tr
><tr id="gr_svn4747_513"

><td id="513"><a href="#513">513</a></td></tr
><tr id="gr_svn4747_514"

><td id="514"><a href="#514">514</a></td></tr
><tr id="gr_svn4747_515"

><td id="515"><a href="#515">515</a></td></tr
><tr id="gr_svn4747_516"

><td id="516"><a href="#516">516</a></td></tr
><tr id="gr_svn4747_517"

><td id="517"><a href="#517">517</a></td></tr
><tr id="gr_svn4747_518"

><td id="518"><a href="#518">518</a></td></tr
><tr id="gr_svn4747_519"

><td id="519"><a href="#519">519</a></td></tr
><tr id="gr_svn4747_520"

><td id="520"><a href="#520">520</a></td></tr
><tr id="gr_svn4747_521"

><td id="521"><a href="#521">521</a></td></tr
><tr id="gr_svn4747_522"

><td id="522"><a href="#522">522</a></td></tr
><tr id="gr_svn4747_523"

><td id="523"><a href="#523">523</a></td></tr
><tr id="gr_svn4747_524"

><td id="524"><a href="#524">524</a></td></tr
><tr id="gr_svn4747_525"

><td id="525"><a href="#525">525</a></td></tr
><tr id="gr_svn4747_526"

><td id="526"><a href="#526">526</a></td></tr
><tr id="gr_svn4747_527"

><td id="527"><a href="#527">527</a></td></tr
><tr id="gr_svn4747_528"

><td id="528"><a href="#528">528</a></td></tr
><tr id="gr_svn4747_529"

><td id="529"><a href="#529">529</a></td></tr
><tr id="gr_svn4747_530"

><td id="530"><a href="#530">530</a></td></tr
><tr id="gr_svn4747_531"

><td id="531"><a href="#531">531</a></td></tr
><tr id="gr_svn4747_532"

><td id="532"><a href="#532">532</a></td></tr
><tr id="gr_svn4747_533"

><td id="533"><a href="#533">533</a></td></tr
><tr id="gr_svn4747_534"

><td id="534"><a href="#534">534</a></td></tr
><tr id="gr_svn4747_535"

><td id="535"><a href="#535">535</a></td></tr
><tr id="gr_svn4747_536"

><td id="536"><a href="#536">536</a></td></tr
><tr id="gr_svn4747_537"

><td id="537"><a href="#537">537</a></td></tr
><tr id="gr_svn4747_538"

><td id="538"><a href="#538">538</a></td></tr
><tr id="gr_svn4747_539"

><td id="539"><a href="#539">539</a></td></tr
><tr id="gr_svn4747_540"

><td id="540"><a href="#540">540</a></td></tr
><tr id="gr_svn4747_541"

><td id="541"><a href="#541">541</a></td></tr
><tr id="gr_svn4747_542"

><td id="542"><a href="#542">542</a></td></tr
><tr id="gr_svn4747_543"

><td id="543"><a href="#543">543</a></td></tr
><tr id="gr_svn4747_544"

><td id="544"><a href="#544">544</a></td></tr
><tr id="gr_svn4747_545"

><td id="545"><a href="#545">545</a></td></tr
><tr id="gr_svn4747_546"

><td id="546"><a href="#546">546</a></td></tr
><tr id="gr_svn4747_547"

><td id="547"><a href="#547">547</a></td></tr
><tr id="gr_svn4747_548"

><td id="548"><a href="#548">548</a></td></tr
><tr id="gr_svn4747_549"

><td id="549"><a href="#549">549</a></td></tr
><tr id="gr_svn4747_550"

><td id="550"><a href="#550">550</a></td></tr
><tr id="gr_svn4747_551"

><td id="551"><a href="#551">551</a></td></tr
><tr id="gr_svn4747_552"

><td id="552"><a href="#552">552</a></td></tr
><tr id="gr_svn4747_553"

><td id="553"><a href="#553">553</a></td></tr
><tr id="gr_svn4747_554"

><td id="554"><a href="#554">554</a></td></tr
><tr id="gr_svn4747_555"

><td id="555"><a href="#555">555</a></td></tr
><tr id="gr_svn4747_556"

><td id="556"><a href="#556">556</a></td></tr
><tr id="gr_svn4747_557"

><td id="557"><a href="#557">557</a></td></tr
><tr id="gr_svn4747_558"

><td id="558"><a href="#558">558</a></td></tr
><tr id="gr_svn4747_559"

><td id="559"><a href="#559">559</a></td></tr
><tr id="gr_svn4747_560"

><td id="560"><a href="#560">560</a></td></tr
><tr id="gr_svn4747_561"

><td id="561"><a href="#561">561</a></td></tr
><tr id="gr_svn4747_562"

><td id="562"><a href="#562">562</a></td></tr
><tr id="gr_svn4747_563"

><td id="563"><a href="#563">563</a></td></tr
><tr id="gr_svn4747_564"

><td id="564"><a href="#564">564</a></td></tr
><tr id="gr_svn4747_565"

><td id="565"><a href="#565">565</a></td></tr
><tr id="gr_svn4747_566"

><td id="566"><a href="#566">566</a></td></tr
><tr id="gr_svn4747_567"

><td id="567"><a href="#567">567</a></td></tr
><tr id="gr_svn4747_568"

><td id="568"><a href="#568">568</a></td></tr
><tr id="gr_svn4747_569"

><td id="569"><a href="#569">569</a></td></tr
><tr id="gr_svn4747_570"

><td id="570"><a href="#570">570</a></td></tr
><tr id="gr_svn4747_571"

><td id="571"><a href="#571">571</a></td></tr
><tr id="gr_svn4747_572"

><td id="572"><a href="#572">572</a></td></tr
><tr id="gr_svn4747_573"

><td id="573"><a href="#573">573</a></td></tr
><tr id="gr_svn4747_574"

><td id="574"><a href="#574">574</a></td></tr
><tr id="gr_svn4747_575"

><td id="575"><a href="#575">575</a></td></tr
><tr id="gr_svn4747_576"

><td id="576"><a href="#576">576</a></td></tr
><tr id="gr_svn4747_577"

><td id="577"><a href="#577">577</a></td></tr
><tr id="gr_svn4747_578"

><td id="578"><a href="#578">578</a></td></tr
><tr id="gr_svn4747_579"

><td id="579"><a href="#579">579</a></td></tr
><tr id="gr_svn4747_580"

><td id="580"><a href="#580">580</a></td></tr
><tr id="gr_svn4747_581"

><td id="581"><a href="#581">581</a></td></tr
><tr id="gr_svn4747_582"

><td id="582"><a href="#582">582</a></td></tr
><tr id="gr_svn4747_583"

><td id="583"><a href="#583">583</a></td></tr
><tr id="gr_svn4747_584"

><td id="584"><a href="#584">584</a></td></tr
><tr id="gr_svn4747_585"

><td id="585"><a href="#585">585</a></td></tr
><tr id="gr_svn4747_586"

><td id="586"><a href="#586">586</a></td></tr
><tr id="gr_svn4747_587"

><td id="587"><a href="#587">587</a></td></tr
><tr id="gr_svn4747_588"

><td id="588"><a href="#588">588</a></td></tr
><tr id="gr_svn4747_589"

><td id="589"><a href="#589">589</a></td></tr
><tr id="gr_svn4747_590"

><td id="590"><a href="#590">590</a></td></tr
><tr id="gr_svn4747_591"

><td id="591"><a href="#591">591</a></td></tr
><tr id="gr_svn4747_592"

><td id="592"><a href="#592">592</a></td></tr
><tr id="gr_svn4747_593"

><td id="593"><a href="#593">593</a></td></tr
><tr id="gr_svn4747_594"

><td id="594"><a href="#594">594</a></td></tr
><tr id="gr_svn4747_595"

><td id="595"><a href="#595">595</a></td></tr
><tr id="gr_svn4747_596"

><td id="596"><a href="#596">596</a></td></tr
><tr id="gr_svn4747_597"

><td id="597"><a href="#597">597</a></td></tr
><tr id="gr_svn4747_598"

><td id="598"><a href="#598">598</a></td></tr
><tr id="gr_svn4747_599"

><td id="599"><a href="#599">599</a></td></tr
><tr id="gr_svn4747_600"

><td id="600"><a href="#600">600</a></td></tr
><tr id="gr_svn4747_601"

><td id="601"><a href="#601">601</a></td></tr
><tr id="gr_svn4747_602"

><td id="602"><a href="#602">602</a></td></tr
><tr id="gr_svn4747_603"

><td id="603"><a href="#603">603</a></td></tr
><tr id="gr_svn4747_604"

><td id="604"><a href="#604">604</a></td></tr
><tr id="gr_svn4747_605"

><td id="605"><a href="#605">605</a></td></tr
><tr id="gr_svn4747_606"

><td id="606"><a href="#606">606</a></td></tr
><tr id="gr_svn4747_607"

><td id="607"><a href="#607">607</a></td></tr
><tr id="gr_svn4747_608"

><td id="608"><a href="#608">608</a></td></tr
><tr id="gr_svn4747_609"

><td id="609"><a href="#609">609</a></td></tr
><tr id="gr_svn4747_610"

><td id="610"><a href="#610">610</a></td></tr
><tr id="gr_svn4747_611"

><td id="611"><a href="#611">611</a></td></tr
><tr id="gr_svn4747_612"

><td id="612"><a href="#612">612</a></td></tr
><tr id="gr_svn4747_613"

><td id="613"><a href="#613">613</a></td></tr
><tr id="gr_svn4747_614"

><td id="614"><a href="#614">614</a></td></tr
><tr id="gr_svn4747_615"

><td id="615"><a href="#615">615</a></td></tr
><tr id="gr_svn4747_616"

><td id="616"><a href="#616">616</a></td></tr
><tr id="gr_svn4747_617"

><td id="617"><a href="#617">617</a></td></tr
><tr id="gr_svn4747_618"

><td id="618"><a href="#618">618</a></td></tr
><tr id="gr_svn4747_619"

><td id="619"><a href="#619">619</a></td></tr
><tr id="gr_svn4747_620"

><td id="620"><a href="#620">620</a></td></tr
><tr id="gr_svn4747_621"

><td id="621"><a href="#621">621</a></td></tr
><tr id="gr_svn4747_622"

><td id="622"><a href="#622">622</a></td></tr
><tr id="gr_svn4747_623"

><td id="623"><a href="#623">623</a></td></tr
><tr id="gr_svn4747_624"

><td id="624"><a href="#624">624</a></td></tr
><tr id="gr_svn4747_625"

><td id="625"><a href="#625">625</a></td></tr
><tr id="gr_svn4747_626"

><td id="626"><a href="#626">626</a></td></tr
></table></pre>
<pre><table width="100%"><tr class="nocursor"><td></td></tr></table></pre>
</td>
<td id="lines">
<pre><table width="100%"><tr class="cursor_stop cursor_hidden"><td></td></tr></table></pre>
<pre class="prettyprint lang-js"><table id="src_table_0"><tr
id=sl_svn4747_1

><td class="source">// Copyright (C) 2006 Google Inc.<br></td></tr
><tr
id=sl_svn4747_2

><td class="source">//<br></td></tr
><tr
id=sl_svn4747_3

><td class="source">// Licensed under the Apache License, Version 2.0 (the &quot;License&quot;);<br></td></tr
><tr
id=sl_svn4747_4

><td class="source">// you may not use this file except in compliance with the License.<br></td></tr
><tr
id=sl_svn4747_5

><td class="source">// You may obtain a copy of the License at<br></td></tr
><tr
id=sl_svn4747_6

><td class="source">//<br></td></tr
><tr
id=sl_svn4747_7

><td class="source">//      http://www.apache.org/licenses/LICENSE-2.0<br></td></tr
><tr
id=sl_svn4747_8

><td class="source">//<br></td></tr
><tr
id=sl_svn4747_9

><td class="source">// Unless required by applicable law or agreed to in writing, software<br></td></tr
><tr
id=sl_svn4747_10

><td class="source">// distributed under the License is distributed on an &quot;AS IS&quot; BASIS,<br></td></tr
><tr
id=sl_svn4747_11

><td class="source">// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.<br></td></tr
><tr
id=sl_svn4747_12

><td class="source">// See the License for the specific language governing permissions and<br></td></tr
><tr
id=sl_svn4747_13

><td class="source">// limitations under the License.<br></td></tr
><tr
id=sl_svn4747_14

><td class="source"><br></td></tr
><tr
id=sl_svn4747_15

><td class="source">/**<br></td></tr
><tr
id=sl_svn4747_16

><td class="source"> * @fileoverview<br></td></tr
><tr
id=sl_svn4747_17

><td class="source"> * An HTML sanitizer that can satisfy a variety of security policies.<br></td></tr
><tr
id=sl_svn4747_18

><td class="source"> *<br></td></tr
><tr
id=sl_svn4747_19

><td class="source"> * &lt;p&gt;<br></td></tr
><tr
id=sl_svn4747_20

><td class="source"> * The HTML sanitizer is built around a SAX parser and HTML element and<br></td></tr
><tr
id=sl_svn4747_21

><td class="source"> * attributes schemas.<br></td></tr
><tr
id=sl_svn4747_22

><td class="source"> *<br></td></tr
><tr
id=sl_svn4747_23

><td class="source"> * @author mikesamuel@gmail.com<br></td></tr
><tr
id=sl_svn4747_24

><td class="source"> * \@requires html4<br></td></tr
><tr
id=sl_svn4747_25

><td class="source"> * \@overrides window<br></td></tr
><tr
id=sl_svn4747_26

><td class="source"> * \@provides html, html_sanitize<br></td></tr
><tr
id=sl_svn4747_27

><td class="source"> */<br></td></tr
><tr
id=sl_svn4747_28

><td class="source"><br></td></tr
><tr
id=sl_svn4747_29

><td class="source">/**<br></td></tr
><tr
id=sl_svn4747_30

><td class="source"> * \@namespace<br></td></tr
><tr
id=sl_svn4747_31

><td class="source"> */<br></td></tr
><tr
id=sl_svn4747_32

><td class="source">var html = (function(html4) {<br></td></tr
><tr
id=sl_svn4747_33

><td class="source">  var lcase;<br></td></tr
><tr
id=sl_svn4747_34

><td class="source">  // The below may not be true on browsers in the Turkish locale.<br></td></tr
><tr
id=sl_svn4747_35

><td class="source">  if (&#39;script&#39; === &#39;SCRIPT&#39;.toLowerCase()) {<br></td></tr
><tr
id=sl_svn4747_36

><td class="source">    lcase = function(s) { return s.toLowerCase(); };<br></td></tr
><tr
id=sl_svn4747_37

><td class="source">  } else {<br></td></tr
><tr
id=sl_svn4747_38

><td class="source">    /**<br></td></tr
><tr
id=sl_svn4747_39

><td class="source">     * {\@updoc<br></td></tr
><tr
id=sl_svn4747_40

><td class="source">     * $ lcase(&#39;SCRIPT&#39;)<br></td></tr
><tr
id=sl_svn4747_41

><td class="source">     * # &#39;script&#39;<br></td></tr
><tr
id=sl_svn4747_42

><td class="source">     * $ lcase(&#39;script&#39;)<br></td></tr
><tr
id=sl_svn4747_43

><td class="source">     * # &#39;script&#39;<br></td></tr
><tr
id=sl_svn4747_44

><td class="source">     * }<br></td></tr
><tr
id=sl_svn4747_45

><td class="source">     */<br></td></tr
><tr
id=sl_svn4747_46

><td class="source">    lcase = function(s) {<br></td></tr
><tr
id=sl_svn4747_47

><td class="source">      return s.replace(<br></td></tr
><tr
id=sl_svn4747_48

><td class="source">          /[A-Z]/g,<br></td></tr
><tr
id=sl_svn4747_49

><td class="source">          function(ch) {<br></td></tr
><tr
id=sl_svn4747_50

><td class="source">            return String.fromCharCode(ch.charCodeAt(0) | 32);<br></td></tr
><tr
id=sl_svn4747_51

><td class="source">          });<br></td></tr
><tr
id=sl_svn4747_52

><td class="source">    };<br></td></tr
><tr
id=sl_svn4747_53

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_54

><td class="source"><br></td></tr
><tr
id=sl_svn4747_55

><td class="source">  // The keys of this object must be &#39;quoted&#39; or JSCompiler will mangle them!<br></td></tr
><tr
id=sl_svn4747_56

><td class="source">  var ENTITIES = {<br></td></tr
><tr
id=sl_svn4747_57

><td class="source">    &#39;lt&#39;: &#39;&lt;&#39;,<br></td></tr
><tr
id=sl_svn4747_58

><td class="source">    &#39;gt&#39;: &#39;&gt;&#39;,<br></td></tr
><tr
id=sl_svn4747_59

><td class="source">    &#39;amp&#39;: &#39;&amp;&#39;,<br></td></tr
><tr
id=sl_svn4747_60

><td class="source">    &#39;nbsp&#39;: &#39;\240&#39;,<br></td></tr
><tr
id=sl_svn4747_61

><td class="source">    &#39;quot&#39;: &#39;&quot;&#39;,<br></td></tr
><tr
id=sl_svn4747_62

><td class="source">    &#39;apos&#39;: &#39;\&#39;&#39;<br></td></tr
><tr
id=sl_svn4747_63

><td class="source">  };<br></td></tr
><tr
id=sl_svn4747_64

><td class="source"><br></td></tr
><tr
id=sl_svn4747_65

><td class="source">  // Schemes on which to defer to uripolicy. Urls with other schemes are denied<br></td></tr
><tr
id=sl_svn4747_66

><td class="source">  var WHITELISTED_SCHEMES = /^(?:https?|mailto)$/i;<br></td></tr
><tr
id=sl_svn4747_67

><td class="source"><br></td></tr
><tr
id=sl_svn4747_68

><td class="source">  var decimalEscapeRe = /^#(\d+)$/;<br></td></tr
><tr
id=sl_svn4747_69

><td class="source">  var hexEscapeRe = /^#x([0-9A-Fa-f]+)$/;<br></td></tr
><tr
id=sl_svn4747_70

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_71

><td class="source">   * Decodes an HTML entity.<br></td></tr
><tr
id=sl_svn4747_72

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_73

><td class="source">   * {\@updoc<br></td></tr
><tr
id=sl_svn4747_74

><td class="source">   * $ lookupEntity(&#39;lt&#39;)<br></td></tr
><tr
id=sl_svn4747_75

><td class="source">   * # &#39;&lt;&#39;<br></td></tr
><tr
id=sl_svn4747_76

><td class="source">   * $ lookupEntity(&#39;GT&#39;)<br></td></tr
><tr
id=sl_svn4747_77

><td class="source">   * # &#39;&gt;&#39;<br></td></tr
><tr
id=sl_svn4747_78

><td class="source">   * $ lookupEntity(&#39;amp&#39;)<br></td></tr
><tr
id=sl_svn4747_79

><td class="source">   * # &#39;&amp;&#39;<br></td></tr
><tr
id=sl_svn4747_80

><td class="source">   * $ lookupEntity(&#39;nbsp&#39;)<br></td></tr
><tr
id=sl_svn4747_81

><td class="source">   * # &#39;\xA0&#39;<br></td></tr
><tr
id=sl_svn4747_82

><td class="source">   * $ lookupEntity(&#39;apos&#39;)<br></td></tr
><tr
id=sl_svn4747_83

><td class="source">   * # &quot;&#39;&quot;<br></td></tr
><tr
id=sl_svn4747_84

><td class="source">   * $ lookupEntity(&#39;quot&#39;)<br></td></tr
><tr
id=sl_svn4747_85

><td class="source">   * # &#39;&quot;&#39;<br></td></tr
><tr
id=sl_svn4747_86

><td class="source">   * $ lookupEntity(&#39;#xa&#39;)<br></td></tr
><tr
id=sl_svn4747_87

><td class="source">   * # &#39;\n&#39;<br></td></tr
><tr
id=sl_svn4747_88

><td class="source">   * $ lookupEntity(&#39;#10&#39;)<br></td></tr
><tr
id=sl_svn4747_89

><td class="source">   * # &#39;\n&#39;<br></td></tr
><tr
id=sl_svn4747_90

><td class="source">   * $ lookupEntity(&#39;#x0a&#39;)<br></td></tr
><tr
id=sl_svn4747_91

><td class="source">   * # &#39;\n&#39;<br></td></tr
><tr
id=sl_svn4747_92

><td class="source">   * $ lookupEntity(&#39;#010&#39;)<br></td></tr
><tr
id=sl_svn4747_93

><td class="source">   * # &#39;\n&#39;<br></td></tr
><tr
id=sl_svn4747_94

><td class="source">   * $ lookupEntity(&#39;#x00A&#39;)<br></td></tr
><tr
id=sl_svn4747_95

><td class="source">   * # &#39;\n&#39;<br></td></tr
><tr
id=sl_svn4747_96

><td class="source">   * $ lookupEntity(&#39;Pi&#39;)      // Known failure<br></td></tr
><tr
id=sl_svn4747_97

><td class="source">   * # &#39;\u03A0&#39;<br></td></tr
><tr
id=sl_svn4747_98

><td class="source">   * $ lookupEntity(&#39;pi&#39;)      // Known failure<br></td></tr
><tr
id=sl_svn4747_99

><td class="source">   * # &#39;\u03C0&#39;<br></td></tr
><tr
id=sl_svn4747_100

><td class="source">   * }<br></td></tr
><tr
id=sl_svn4747_101

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_102

><td class="source">   * @param {string} name the content between the &#39;&amp;&#39; and the &#39;;&#39;.<br></td></tr
><tr
id=sl_svn4747_103

><td class="source">   * @return {string} a single unicode code-point as a string.<br></td></tr
><tr
id=sl_svn4747_104

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_105

><td class="source">  function lookupEntity(name) {<br></td></tr
><tr
id=sl_svn4747_106

><td class="source">    name = lcase(name);  // TODO: &amp;pi; is different from &amp;Pi;<br></td></tr
><tr
id=sl_svn4747_107

><td class="source">    if (ENTITIES.hasOwnProperty(name)) { return ENTITIES[name]; }<br></td></tr
><tr
id=sl_svn4747_108

><td class="source">    var m = name.match(decimalEscapeRe);<br></td></tr
><tr
id=sl_svn4747_109

><td class="source">    if (m) {<br></td></tr
><tr
id=sl_svn4747_110

><td class="source">      return String.fromCharCode(parseInt(m[1], 10));<br></td></tr
><tr
id=sl_svn4747_111

><td class="source">    } else if (!!(m = name.match(hexEscapeRe))) {<br></td></tr
><tr
id=sl_svn4747_112

><td class="source">      return String.fromCharCode(parseInt(m[1], 16));<br></td></tr
><tr
id=sl_svn4747_113

><td class="source">    }<br></td></tr
><tr
id=sl_svn4747_114

><td class="source">    return &#39;&#39;;<br></td></tr
><tr
id=sl_svn4747_115

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_116

><td class="source"><br></td></tr
><tr
id=sl_svn4747_117

><td class="source">  function decodeOneEntity(_, name) {<br></td></tr
><tr
id=sl_svn4747_118

><td class="source">    return lookupEntity(name);<br></td></tr
><tr
id=sl_svn4747_119

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_120

><td class="source"><br></td></tr
><tr
id=sl_svn4747_121

><td class="source">  var nulRe = /\0/g;<br></td></tr
><tr
id=sl_svn4747_122

><td class="source">  function stripNULs(s) {<br></td></tr
><tr
id=sl_svn4747_123

><td class="source">    return s.replace(nulRe, &#39;&#39;);<br></td></tr
><tr
id=sl_svn4747_124

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_125

><td class="source"><br></td></tr
><tr
id=sl_svn4747_126

><td class="source">  var entityRe = /&amp;(#\d+|#x[0-9A-Fa-f]+|\w+);/g;<br></td></tr
><tr
id=sl_svn4747_127

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_128

><td class="source">   * The plain text of a chunk of HTML CDATA which possibly containing.<br></td></tr
><tr
id=sl_svn4747_129

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_130

><td class="source">   * {\@updoc<br></td></tr
><tr
id=sl_svn4747_131

><td class="source">   * $ unescapeEntities(&#39;&#39;)<br></td></tr
><tr
id=sl_svn4747_132

><td class="source">   * # &#39;&#39;<br></td></tr
><tr
id=sl_svn4747_133

><td class="source">   * $ unescapeEntities(&#39;hello World!&#39;)<br></td></tr
><tr
id=sl_svn4747_134

><td class="source">   * # &#39;hello World!&#39;<br></td></tr
><tr
id=sl_svn4747_135

><td class="source">   * $ unescapeEntities(&#39;1 &amp;lt; 2 &amp;amp;&amp;AMP; 4 &amp;gt; 3&amp;#10;&#39;)<br></td></tr
><tr
id=sl_svn4747_136

><td class="source">   * # &#39;1 &lt; 2 &amp;&amp; 4 &gt; 3\n&#39;<br></td></tr
><tr
id=sl_svn4747_137

><td class="source">   * $ unescapeEntities(&#39;&amp;lt;&amp;lt &lt;- unfinished entity&amp;gt;&#39;)<br></td></tr
><tr
id=sl_svn4747_138

><td class="source">   * # &#39;&lt;&amp;lt &lt;- unfinished entity&gt;&#39;<br></td></tr
><tr
id=sl_svn4747_139

><td class="source">   * $ unescapeEntities(&#39;/foo?bar=baz&amp;copy=true&#39;)  // &amp; often unescaped in URLS<br></td></tr
><tr
id=sl_svn4747_140

><td class="source">   * # &#39;/foo?bar=baz&amp;copy=true&#39;<br></td></tr
><tr
id=sl_svn4747_141

><td class="source">   * $ unescapeEntities(&#39;pi=&amp;pi;&amp;#x3c0;, Pi=&amp;Pi;\u03A0&#39;) // FIXME: known failure<br></td></tr
><tr
id=sl_svn4747_142

><td class="source">   * # &#39;pi=\u03C0\u03c0, Pi=\u03A0\u03A0&#39;<br></td></tr
><tr
id=sl_svn4747_143

><td class="source">   * }<br></td></tr
><tr
id=sl_svn4747_144

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_145

><td class="source">   * @param {string} s a chunk of HTML CDATA.  It must not start or end inside<br></td></tr
><tr
id=sl_svn4747_146

><td class="source">   *     an HTML entity.<br></td></tr
><tr
id=sl_svn4747_147

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_148

><td class="source">  function unescapeEntities(s) {<br></td></tr
><tr
id=sl_svn4747_149

><td class="source">    return s.replace(entityRe, decodeOneEntity);<br></td></tr
><tr
id=sl_svn4747_150

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_151

><td class="source"><br></td></tr
><tr
id=sl_svn4747_152

><td class="source">  var ampRe = /&amp;/g;<br></td></tr
><tr
id=sl_svn4747_153

><td class="source">  var looseAmpRe = /&amp;([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;<br></td></tr
><tr
id=sl_svn4747_154

><td class="source">  var ltRe = /&lt;/g;<br></td></tr
><tr
id=sl_svn4747_155

><td class="source">  var gtRe = /&gt;/g;<br></td></tr
><tr
id=sl_svn4747_156

><td class="source">  var quotRe = /\&quot;/g;<br></td></tr
><tr
id=sl_svn4747_157

><td class="source"><br></td></tr
><tr
id=sl_svn4747_158

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_159

><td class="source">   * Escapes HTML special characters in attribute values.<br></td></tr
><tr
id=sl_svn4747_160

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_161

><td class="source">   * {\@updoc<br></td></tr
><tr
id=sl_svn4747_162

><td class="source">   * $ escapeAttrib(&#39;&#39;)<br></td></tr
><tr
id=sl_svn4747_163

><td class="source">   * # &#39;&#39;<br></td></tr
><tr
id=sl_svn4747_164

><td class="source">   * $ escapeAttrib(&#39;&quot;&lt;&lt;&amp;==&amp;&gt;&gt;&quot;&#39;)  // Do not just escape the first occurrence.<br></td></tr
><tr
id=sl_svn4747_165

><td class="source">   * # &#39;&amp;#34;&amp;lt;&amp;lt;&amp;amp;&amp;#61;&amp;#61;&amp;amp;&amp;gt;&amp;gt;&amp;#34;&#39;<br></td></tr
><tr
id=sl_svn4747_166

><td class="source">   * $ escapeAttrib(&#39;Hello &lt;World&gt;!&#39;)<br></td></tr
><tr
id=sl_svn4747_167

><td class="source">   * # &#39;Hello &amp;lt;World&amp;gt;!&#39;<br></td></tr
><tr
id=sl_svn4747_168

><td class="source">   * }<br></td></tr
><tr
id=sl_svn4747_169

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_170

><td class="source">  function escapeAttrib(s) {<br></td></tr
><tr
id=sl_svn4747_171

><td class="source">    return (&#39;&#39; + s).replace(ampRe, &#39;&amp;amp;&#39;).replace(ltRe, &#39;&amp;lt;&#39;)<br></td></tr
><tr
id=sl_svn4747_172

><td class="source">        .replace(gtRe, &#39;&amp;gt;&#39;).replace(quotRe, &#39;&amp;#34;&#39;);<br></td></tr
><tr
id=sl_svn4747_173

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_174

><td class="source"><br></td></tr
><tr
id=sl_svn4747_175

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_176

><td class="source">   * Escape entities in RCDATA that can be escaped without changing the meaning.<br></td></tr
><tr
id=sl_svn4747_177

><td class="source">   * {\@updoc<br></td></tr
><tr
id=sl_svn4747_178

><td class="source">   * $ normalizeRCData(&#39;1 &lt; 2 &amp;&amp;amp; 3 &gt; 4 &amp;amp;&amp; 5 &amp;lt; 7&amp;8&#39;)<br></td></tr
><tr
id=sl_svn4747_179

><td class="source">   * # &#39;1 &amp;lt; 2 &amp;amp;&amp;amp; 3 &amp;gt; 4 &amp;amp;&amp;amp; 5 &amp;lt; 7&amp;amp;8&#39;<br></td></tr
><tr
id=sl_svn4747_180

><td class="source">   * }<br></td></tr
><tr
id=sl_svn4747_181

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_182

><td class="source">  function normalizeRCData(rcdata) {<br></td></tr
><tr
id=sl_svn4747_183

><td class="source">    return rcdata<br></td></tr
><tr
id=sl_svn4747_184

><td class="source">        .replace(looseAmpRe, &#39;&amp;amp;$1&#39;)<br></td></tr
><tr
id=sl_svn4747_185

><td class="source">        .replace(ltRe, &#39;&amp;lt;&#39;)<br></td></tr
><tr
id=sl_svn4747_186

><td class="source">        .replace(gtRe, &#39;&amp;gt;&#39;);<br></td></tr
><tr
id=sl_svn4747_187

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_188

><td class="source"><br></td></tr
><tr
id=sl_svn4747_189

><td class="source"><br></td></tr
><tr
id=sl_svn4747_190

><td class="source">  // TODO(mikesamuel): validate sanitizer regexs against the HTML5 grammar at<br></td></tr
><tr
id=sl_svn4747_191

><td class="source">  // http://www.whatwg.org/specs/web-apps/current-work/multipage/syntax.html<br></td></tr
><tr
id=sl_svn4747_192

><td class="source">  // http://www.whatwg.org/specs/web-apps/current-work/multipage/parsing.html<br></td></tr
><tr
id=sl_svn4747_193

><td class="source">  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tokenization.html<br></td></tr
><tr
id=sl_svn4747_194

><td class="source">  // http://www.whatwg.org/specs/web-apps/current-work/multipage/tree-construction.html<br></td></tr
><tr
id=sl_svn4747_195

><td class="source"><br></td></tr
><tr
id=sl_svn4747_196

><td class="source">  /** token definitions. */<br></td></tr
><tr
id=sl_svn4747_197

><td class="source">  var INSIDE_TAG_TOKEN = new RegExp(<br></td></tr
><tr
id=sl_svn4747_198

><td class="source">      // Don&#39;t capture space.<br></td></tr
><tr
id=sl_svn4747_199

><td class="source">      &#39;^\\s*(?:&#39; + (<br></td></tr
><tr
id=sl_svn4747_200

><td class="source">        // Capture an attribute name in group 1, and value in group 3.<br></td></tr
><tr
id=sl_svn4747_201

><td class="source">        // We capture the fact that there was an attribute in group 2, since<br></td></tr
><tr
id=sl_svn4747_202

><td class="source">        // interpreters are inconsistent in whether a group that matches nothing<br></td></tr
><tr
id=sl_svn4747_203

><td class="source">        // is null, undefined, or the empty string.<br></td></tr
><tr
id=sl_svn4747_204

><td class="source">        &#39;(?:&#39; +<br></td></tr
><tr
id=sl_svn4747_205

><td class="source">        &#39;([a-z][a-z-]*)&#39; + (                  // attribute name<br></td></tr
><tr
id=sl_svn4747_206

><td class="source">          &#39;(&#39; +                                // optionally followed<br></td></tr
><tr
id=sl_svn4747_207

><td class="source">          &#39;\\s*=\\s*&#39; + (<br></td></tr
><tr
id=sl_svn4747_208

><td class="source">            &#39;(&#39; +<br></td></tr
><tr
id=sl_svn4747_209

><td class="source">            // A double quoted string.<br></td></tr
><tr
id=sl_svn4747_210

><td class="source">            &#39;\&quot;[^\&quot;]*\&quot;&#39; +<br></td></tr
><tr
id=sl_svn4747_211

><td class="source">            // A single quoted string.<br></td></tr
><tr
id=sl_svn4747_212

><td class="source">            &#39;|\&#39;[^\&#39;]*\&#39;&#39; +<br></td></tr
><tr
id=sl_svn4747_213

><td class="source">            // The positive lookahead is used to make sure that in<br></td></tr
><tr
id=sl_svn4747_214

><td class="source">            // &lt;foo bar= baz=boo&gt;, the value for bar is blank, not &quot;baz=boo&quot;.<br></td></tr
><tr
id=sl_svn4747_215

><td class="source">            &#39;|(?=[a-z][a-z-]*\\s*=)&#39; +<br></td></tr
><tr
id=sl_svn4747_216

><td class="source">            // An unquoted value that is not an attribute name.<br></td></tr
><tr
id=sl_svn4747_217

><td class="source">            // We know it is not an attribute name because the previous<br></td></tr
><tr
id=sl_svn4747_218

><td class="source">            // zero-width match would&#39;ve eliminated that possibility.<br></td></tr
><tr
id=sl_svn4747_219

><td class="source">            &#39;|[^&gt;\&quot;\&#39;\\s]*&#39; +<br></td></tr
><tr
id=sl_svn4747_220

><td class="source">            &#39;)&#39;<br></td></tr
><tr
id=sl_svn4747_221

><td class="source">          ) +<br></td></tr
><tr
id=sl_svn4747_222

><td class="source">          &#39;)&#39;<br></td></tr
><tr
id=sl_svn4747_223

><td class="source">        ) + &#39;?&#39; +<br></td></tr
><tr
id=sl_svn4747_224

><td class="source">        &#39;)&#39;<br></td></tr
><tr
id=sl_svn4747_225

><td class="source">      ) +<br></td></tr
><tr
id=sl_svn4747_226

><td class="source">      // End of tag captured in group 3.<br></td></tr
><tr
id=sl_svn4747_227

><td class="source">      &#39;|(/?&gt;)&#39; +<br></td></tr
><tr
id=sl_svn4747_228

><td class="source">      // Don&#39;t capture cruft<br></td></tr
><tr
id=sl_svn4747_229

><td class="source">      &#39;|[\\s\\S][^a-z\\s&gt;]*)&#39;,<br></td></tr
><tr
id=sl_svn4747_230

><td class="source">      &#39;i&#39;);<br></td></tr
><tr
id=sl_svn4747_231

><td class="source"><br></td></tr
><tr
id=sl_svn4747_232

><td class="source">  var OUTSIDE_TAG_TOKEN = new RegExp(<br></td></tr
><tr
id=sl_svn4747_233

><td class="source">      &#39;^(?:&#39; +<br></td></tr
><tr
id=sl_svn4747_234

><td class="source">      // Entity captured in group 1.<br></td></tr
><tr
id=sl_svn4747_235

><td class="source">      &#39;&amp;(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);&#39; +<br></td></tr
><tr
id=sl_svn4747_236

><td class="source">      // Comment, doctypes, and processing instructions not captured.<br></td></tr
><tr
id=sl_svn4747_237

><td class="source">      &#39;|&lt;\!--[\\s\\S]*?--\&gt;|&lt;!\\w[^&gt;]*&gt;|&lt;\\?[^&gt;*]*&gt;&#39; +<br></td></tr
><tr
id=sl_svn4747_238

><td class="source">      // &#39;/&#39; captured in group 2 for close tags, and name captured in group 3.<br></td></tr
><tr
id=sl_svn4747_239

><td class="source">      &#39;|&lt;(/)?([a-z][a-z0-9]*)&#39; +<br></td></tr
><tr
id=sl_svn4747_240

><td class="source">      // Text captured in group 4.<br></td></tr
><tr
id=sl_svn4747_241

><td class="source">      &#39;|([^&lt;&amp;&gt;]+)&#39; +<br></td></tr
><tr
id=sl_svn4747_242

><td class="source">      // Cruft captured in group 5.<br></td></tr
><tr
id=sl_svn4747_243

><td class="source">      &#39;|([&lt;&amp;&gt;]))&#39;,<br></td></tr
><tr
id=sl_svn4747_244

><td class="source">      &#39;i&#39;);<br></td></tr
><tr
id=sl_svn4747_245

><td class="source"><br></td></tr
><tr
id=sl_svn4747_246

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_247

><td class="source">   * Given a SAX-like event handler, produce a function that feeds those<br></td></tr
><tr
id=sl_svn4747_248

><td class="source">   * events and a parameter to the event handler.<br></td></tr
><tr
id=sl_svn4747_249

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_250

><td class="source">   * The event handler has the form:{@code<br></td></tr
><tr
id=sl_svn4747_251

><td class="source">   * {<br></td></tr
><tr
id=sl_svn4747_252

><td class="source">   *   // Name is an upper-case HTML tag name.  Attribs is an array of<br></td></tr
><tr
id=sl_svn4747_253

><td class="source">   *   // alternating upper-case attribute names, and attribute values.  The<br></td></tr
><tr
id=sl_svn4747_254

><td class="source">   *   // attribs array is reused by the parser.  Param is the value passed to<br></td></tr
><tr
id=sl_svn4747_255

><td class="source">   *   // the saxParser.<br></td></tr
><tr
id=sl_svn4747_256

><td class="source">   *   startTag: function (name, attribs, param) { ... },<br></td></tr
><tr
id=sl_svn4747_257

><td class="source">   *   endTag:   function (name, param) { ... },<br></td></tr
><tr
id=sl_svn4747_258

><td class="source">   *   pcdata:   function (text, param) { ... },<br></td></tr
><tr
id=sl_svn4747_259

><td class="source">   *   rcdata:   function (text, param) { ... },<br></td></tr
><tr
id=sl_svn4747_260

><td class="source">   *   cdata:    function (text, param) { ... },<br></td></tr
><tr
id=sl_svn4747_261

><td class="source">   *   startDoc: function (param) { ... },<br></td></tr
><tr
id=sl_svn4747_262

><td class="source">   *   endDoc:   function (param) { ... }<br></td></tr
><tr
id=sl_svn4747_263

><td class="source">   * }}<br></td></tr
><tr
id=sl_svn4747_264

><td class="source">   *<br></td></tr
><tr
id=sl_svn4747_265

><td class="source">   * @param {Object} handler a record containing event handlers.<br></td></tr
><tr
id=sl_svn4747_266

><td class="source">   * @return {function(string, Object)} A function that takes a chunk of HTML<br></td></tr
><tr
id=sl_svn4747_267

><td class="source">   *     and a parameter.  The parameter is passed on to the handler methods.<br></td></tr
><tr
id=sl_svn4747_268

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_269

><td class="source">  function makeSaxParser(handler) {<br></td></tr
><tr
id=sl_svn4747_270

><td class="source">    return function parse(htmlText, param) {<br></td></tr
><tr
id=sl_svn4747_271

><td class="source">      htmlText = String(htmlText);<br></td></tr
><tr
id=sl_svn4747_272

><td class="source">      var htmlLower = null;<br></td></tr
><tr
id=sl_svn4747_273

><td class="source"><br></td></tr
><tr
id=sl_svn4747_274

><td class="source">      var inTag = false;  // True iff we&#39;re currently processing a tag.<br></td></tr
><tr
id=sl_svn4747_275

><td class="source">      var attribs = [];  // Accumulates attribute names and values.<br></td></tr
><tr
id=sl_svn4747_276

><td class="source">      var tagName = void 0;  // The name of the tag currently being processed.<br></td></tr
><tr
id=sl_svn4747_277

><td class="source">      var eflags = void 0;  // The element flags for the current tag.<br></td></tr
><tr
id=sl_svn4747_278

><td class="source">      var openTag = void 0;  // True if the current tag is an open tag.<br></td></tr
><tr
id=sl_svn4747_279

><td class="source"><br></td></tr
><tr
id=sl_svn4747_280

><td class="source">      if (handler.startDoc) { handler.startDoc(param); }<br></td></tr
><tr
id=sl_svn4747_281

><td class="source"><br></td></tr
><tr
id=sl_svn4747_282

><td class="source">      while (htmlText) {<br></td></tr
><tr
id=sl_svn4747_283

><td class="source">        var m = htmlText.match(inTag ? INSIDE_TAG_TOKEN : OUTSIDE_TAG_TOKEN);<br></td></tr
><tr
id=sl_svn4747_284

><td class="source">        htmlText = htmlText.substring(m[0].length);<br></td></tr
><tr
id=sl_svn4747_285

><td class="source"><br></td></tr
><tr
id=sl_svn4747_286

><td class="source">        if (inTag) {<br></td></tr
><tr
id=sl_svn4747_287

><td class="source">          if (m[1]) { // attribute<br></td></tr
><tr
id=sl_svn4747_288

><td class="source">            // setAttribute with uppercase names doesn&#39;t work on IE6.<br></td></tr
><tr
id=sl_svn4747_289

><td class="source">            var attribName = lcase(m[1]);<br></td></tr
><tr
id=sl_svn4747_290

><td class="source">            var decodedValue;<br></td></tr
><tr
id=sl_svn4747_291

><td class="source">            if (m[2]) {<br></td></tr
><tr
id=sl_svn4747_292

><td class="source">              var encodedValue = m[3];<br></td></tr
><tr
id=sl_svn4747_293

><td class="source">              switch (encodedValue.charCodeAt(0)) {  // Strip quotes<br></td></tr
><tr
id=sl_svn4747_294

><td class="source">                case 34: case 39:<br></td></tr
><tr
id=sl_svn4747_295

><td class="source">                  encodedValue = encodedValue.substring(<br></td></tr
><tr
id=sl_svn4747_296

><td class="source">                      1, encodedValue.length - 1);<br></td></tr
><tr
id=sl_svn4747_297

><td class="source">                  break;<br></td></tr
><tr
id=sl_svn4747_298

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_299

><td class="source">              decodedValue = unescapeEntities(stripNULs(encodedValue));<br></td></tr
><tr
id=sl_svn4747_300

><td class="source">            } else {<br></td></tr
><tr
id=sl_svn4747_301

><td class="source">              // Use name as value for valueless attribs, so<br></td></tr
><tr
id=sl_svn4747_302

><td class="source">              //   &lt;input type=checkbox checked&gt;<br></td></tr
><tr
id=sl_svn4747_303

><td class="source">              // gets attributes [&#39;type&#39;, &#39;checkbox&#39;, &#39;checked&#39;, &#39;checked&#39;]<br></td></tr
><tr
id=sl_svn4747_304

><td class="source">              decodedValue = attribName;<br></td></tr
><tr
id=sl_svn4747_305

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_306

><td class="source">            attribs.push(attribName, decodedValue);<br></td></tr
><tr
id=sl_svn4747_307

><td class="source">          } else if (m[4]) {<br></td></tr
><tr
id=sl_svn4747_308

><td class="source">            if (eflags !== void 0) {  // False if not in whitelist.<br></td></tr
><tr
id=sl_svn4747_309

><td class="source">              if (openTag) {<br></td></tr
><tr
id=sl_svn4747_310

><td class="source">                if (handler.startTag) {<br></td></tr
><tr
id=sl_svn4747_311

><td class="source">                  handler.startTag(tagName, attribs, param);<br></td></tr
><tr
id=sl_svn4747_312

><td class="source">                }<br></td></tr
><tr
id=sl_svn4747_313

><td class="source">              } else {<br></td></tr
><tr
id=sl_svn4747_314

><td class="source">                if (handler.endTag) {<br></td></tr
><tr
id=sl_svn4747_315

><td class="source">                  handler.endTag(tagName, param);<br></td></tr
><tr
id=sl_svn4747_316

><td class="source">                }<br></td></tr
><tr
id=sl_svn4747_317

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_318

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_319

><td class="source"><br></td></tr
><tr
id=sl_svn4747_320

><td class="source">            if (openTag &amp;&amp;<br></td></tr
><tr
id=sl_svn4747_321

><td class="source">                (eflags &amp; (html4.eflags.CDATA | html4.eflags.RCDATA))) {<br></td></tr
><tr
id=sl_svn4747_322

><td class="source">              if (htmlLower === null) {<br></td></tr
><tr
id=sl_svn4747_323

><td class="source">                htmlLower = lcase(htmlText);<br></td></tr
><tr
id=sl_svn4747_324

><td class="source">              } else {<br></td></tr
><tr
id=sl_svn4747_325

><td class="source">                htmlLower = htmlLower.substring(<br></td></tr
><tr
id=sl_svn4747_326

><td class="source">                    htmlLower.length - htmlText.length);<br></td></tr
><tr
id=sl_svn4747_327

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_328

><td class="source">              var dataEnd = htmlLower.indexOf(&#39;&lt;/&#39; + tagName);<br></td></tr
><tr
id=sl_svn4747_329

><td class="source">              if (dataEnd &lt; 0) { dataEnd = htmlText.length; }<br></td></tr
><tr
id=sl_svn4747_330

><td class="source">              if (dataEnd) {<br></td></tr
><tr
id=sl_svn4747_331

><td class="source">                if (eflags &amp; html4.eflags.CDATA) {<br></td></tr
><tr
id=sl_svn4747_332

><td class="source">                  if (handler.cdata) {<br></td></tr
><tr
id=sl_svn4747_333

><td class="source">                    handler.cdata(htmlText.substring(0, dataEnd), param);<br></td></tr
><tr
id=sl_svn4747_334

><td class="source">                  }<br></td></tr
><tr
id=sl_svn4747_335

><td class="source">                } else if (handler.rcdata) {<br></td></tr
><tr
id=sl_svn4747_336

><td class="source">                  handler.rcdata(<br></td></tr
><tr
id=sl_svn4747_337

><td class="source">                      normalizeRCData(htmlText.substring(0, dataEnd)), param);<br></td></tr
><tr
id=sl_svn4747_338

><td class="source">                }<br></td></tr
><tr
id=sl_svn4747_339

><td class="source">                htmlText = htmlText.substring(dataEnd);<br></td></tr
><tr
id=sl_svn4747_340

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_341

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_342

><td class="source"><br></td></tr
><tr
id=sl_svn4747_343

><td class="source">            tagName = eflags = openTag = void 0;<br></td></tr
><tr
id=sl_svn4747_344

><td class="source">            attribs.length = 0;<br></td></tr
><tr
id=sl_svn4747_345

><td class="source">            inTag = false;<br></td></tr
><tr
id=sl_svn4747_346

><td class="source">          }<br></td></tr
><tr
id=sl_svn4747_347

><td class="source">        } else {<br></td></tr
><tr
id=sl_svn4747_348

><td class="source">          if (m[1]) {  // Entity<br></td></tr
><tr
id=sl_svn4747_349

><td class="source">            if (handler.pcdata) { handler.pcdata(m[0], param); }<br></td></tr
><tr
id=sl_svn4747_350

><td class="source">          } else if (m[3]) {  // Tag<br></td></tr
><tr
id=sl_svn4747_351

><td class="source">            openTag = !m[2];<br></td></tr
><tr
id=sl_svn4747_352

><td class="source">            inTag = true;<br></td></tr
><tr
id=sl_svn4747_353

><td class="source">            tagName = lcase(m[3]);<br></td></tr
><tr
id=sl_svn4747_354

><td class="source">            eflags = html4.ELEMENTS.hasOwnProperty(tagName) ?<br></td></tr
><tr
id=sl_svn4747_355

><td class="source">                html4.ELEMENTS[tagName] : void 0;<br></td></tr
><tr
id=sl_svn4747_356

><td class="source">          } else if (m[4]) {  // Text<br></td></tr
><tr
id=sl_svn4747_357

><td class="source">            if (handler.pcdata) { handler.pcdata(m[4], param); }<br></td></tr
><tr
id=sl_svn4747_358

><td class="source">          } else if (m[5]) {  // Cruft<br></td></tr
><tr
id=sl_svn4747_359

><td class="source">            if (handler.pcdata) {<br></td></tr
><tr
id=sl_svn4747_360

><td class="source">              switch (m[5]) {<br></td></tr
><tr
id=sl_svn4747_361

><td class="source">                case &#39;&lt;&#39;: handler.pcdata(&#39;&amp;lt;&#39;, param); break;<br></td></tr
><tr
id=sl_svn4747_362

><td class="source">                case &#39;&gt;&#39;: handler.pcdata(&#39;&amp;gt;&#39;, param); break;<br></td></tr
><tr
id=sl_svn4747_363

><td class="source">                case &#39;&amp;&#39;: handler.pcdata(&#39;&amp;amp;&#39;, param); break;<br></td></tr
><tr
id=sl_svn4747_364

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_365

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_366

><td class="source">          }<br></td></tr
><tr
id=sl_svn4747_367

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_368

><td class="source">      }<br></td></tr
><tr
id=sl_svn4747_369

><td class="source"><br></td></tr
><tr
id=sl_svn4747_370

><td class="source">      if (handler.endDoc) { handler.endDoc(param); }<br></td></tr
><tr
id=sl_svn4747_371

><td class="source">    };<br></td></tr
><tr
id=sl_svn4747_372

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_373

><td class="source"><br></td></tr
><tr
id=sl_svn4747_374

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_375

><td class="source">   * Returns a function that strips unsafe tags and attributes from html.<br></td></tr
><tr
id=sl_svn4747_376

><td class="source">   * @param {function(string, Array.&lt;string&gt;): ?Array.&lt;string&gt;} tagPolicy<br></td></tr
><tr
id=sl_svn4747_377

><td class="source">   *     A function that takes (tagName, attribs[]), where tagName is a key in<br></td></tr
><tr
id=sl_svn4747_378

><td class="source">   *     html4.ELEMENTS and attribs is an array of alternating attribute names<br></td></tr
><tr
id=sl_svn4747_379

><td class="source">   *     and values.  It should return a sanitized attribute array, or null to<br></td></tr
><tr
id=sl_svn4747_380

><td class="source">   *     delete the tag.  It&#39;s okay for tagPolicy to modify the attribs array,<br></td></tr
><tr
id=sl_svn4747_381

><td class="source">   *     but the same array is reused, so it should not be held between calls.<br></td></tr
><tr
id=sl_svn4747_382

><td class="source">   * @return {function(string, Array)} A function that sanitizes a string of<br></td></tr
><tr
id=sl_svn4747_383

><td class="source">   *     HTML and appends result strings to the second argument, an array.<br></td></tr
><tr
id=sl_svn4747_384

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_385

><td class="source">  function makeHtmlSanitizer(tagPolicy) {<br></td></tr
><tr
id=sl_svn4747_386

><td class="source">    var stack;<br></td></tr
><tr
id=sl_svn4747_387

><td class="source">    var ignoring;<br></td></tr
><tr
id=sl_svn4747_388

><td class="source">    return makeSaxParser({<br></td></tr
><tr
id=sl_svn4747_389

><td class="source">      startDoc: function(_) {<br></td></tr
><tr
id=sl_svn4747_390

><td class="source">        stack = [];<br></td></tr
><tr
id=sl_svn4747_391

><td class="source">        ignoring = false;<br></td></tr
><tr
id=sl_svn4747_392

><td class="source">      },<br></td></tr
><tr
id=sl_svn4747_393

><td class="source">      startTag: function(tagName, attribs, out) {<br></td></tr
><tr
id=sl_svn4747_394

><td class="source">        if (ignoring) { return; }<br></td></tr
><tr
id=sl_svn4747_395

><td class="source">        if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }<br></td></tr
><tr
id=sl_svn4747_396

><td class="source">        var eflags = html4.ELEMENTS[tagName];<br></td></tr
><tr
id=sl_svn4747_397

><td class="source">        if (eflags &amp; html4.eflags.FOLDABLE) {<br></td></tr
><tr
id=sl_svn4747_398

><td class="source">          return;<br></td></tr
><tr
id=sl_svn4747_399

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_400

><td class="source">        attribs = tagPolicy(tagName, attribs);<br></td></tr
><tr
id=sl_svn4747_401

><td class="source">        if (!attribs) {<br></td></tr
><tr
id=sl_svn4747_402

><td class="source">          ignoring = !(eflags &amp; html4.eflags.EMPTY);<br></td></tr
><tr
id=sl_svn4747_403

><td class="source">          return;<br></td></tr
><tr
id=sl_svn4747_404

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_405

><td class="source">        // TODO(mikesamuel): relying on tagPolicy not to insert unsafe<br></td></tr
><tr
id=sl_svn4747_406

><td class="source">        // attribute names.<br></td></tr
><tr
id=sl_svn4747_407

><td class="source">        if (!(eflags &amp; html4.eflags.EMPTY)) {<br></td></tr
><tr
id=sl_svn4747_408

><td class="source">          stack.push(tagName);<br></td></tr
><tr
id=sl_svn4747_409

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_410

><td class="source"><br></td></tr
><tr
id=sl_svn4747_411

><td class="source">        out.push(&#39;&lt;&#39;, tagName);<br></td></tr
><tr
id=sl_svn4747_412

><td class="source">        for (var i = 0, n = attribs.length; i &lt; n; i += 2) {<br></td></tr
><tr
id=sl_svn4747_413

><td class="source">          var attribName = attribs[i],<br></td></tr
><tr
id=sl_svn4747_414

><td class="source">              value = attribs[i + 1];<br></td></tr
><tr
id=sl_svn4747_415

><td class="source">          if (value !== null &amp;&amp; value !== void 0) {<br></td></tr
><tr
id=sl_svn4747_416

><td class="source">            out.push(&#39; &#39;, attribName, &#39;=&quot;&#39;, escapeAttrib(value), &#39;&quot;&#39;);<br></td></tr
><tr
id=sl_svn4747_417

><td class="source">          }<br></td></tr
><tr
id=sl_svn4747_418

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_419

><td class="source">        out.push(&#39;&gt;&#39;);<br></td></tr
><tr
id=sl_svn4747_420

><td class="source">      },<br></td></tr
><tr
id=sl_svn4747_421

><td class="source">      endTag: function(tagName, out) {<br></td></tr
><tr
id=sl_svn4747_422

><td class="source">        if (ignoring) {<br></td></tr
><tr
id=sl_svn4747_423

><td class="source">          ignoring = false;<br></td></tr
><tr
id=sl_svn4747_424

><td class="source">          return;<br></td></tr
><tr
id=sl_svn4747_425

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_426

><td class="source">        if (!html4.ELEMENTS.hasOwnProperty(tagName)) { return; }<br></td></tr
><tr
id=sl_svn4747_427

><td class="source">        var eflags = html4.ELEMENTS[tagName];<br></td></tr
><tr
id=sl_svn4747_428

><td class="source">        if (!(eflags &amp; (html4.eflags.EMPTY | html4.eflags.FOLDABLE))) {<br></td></tr
><tr
id=sl_svn4747_429

><td class="source">          var index;<br></td></tr
><tr
id=sl_svn4747_430

><td class="source">          if (eflags &amp; html4.eflags.OPTIONAL_ENDTAG) {<br></td></tr
><tr
id=sl_svn4747_431

><td class="source">            for (index = stack.length; --index &gt;= 0;) {<br></td></tr
><tr
id=sl_svn4747_432

><td class="source">              var stackEl = stack[index];<br></td></tr
><tr
id=sl_svn4747_433

><td class="source">              if (stackEl === tagName) { break; }<br></td></tr
><tr
id=sl_svn4747_434

><td class="source">              if (!(html4.ELEMENTS[stackEl] &amp;<br></td></tr
><tr
id=sl_svn4747_435

><td class="source">                    html4.eflags.OPTIONAL_ENDTAG)) {<br></td></tr
><tr
id=sl_svn4747_436

><td class="source">                // Don&#39;t pop non optional end tags looking for a match.<br></td></tr
><tr
id=sl_svn4747_437

><td class="source">                return;<br></td></tr
><tr
id=sl_svn4747_438

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_439

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_440

><td class="source">          } else {<br></td></tr
><tr
id=sl_svn4747_441

><td class="source">            for (index = stack.length; --index &gt;= 0;) {<br></td></tr
><tr
id=sl_svn4747_442

><td class="source">              if (stack[index] === tagName) { break; }<br></td></tr
><tr
id=sl_svn4747_443

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_444

><td class="source">          }<br></td></tr
><tr
id=sl_svn4747_445

><td class="source">          if (index &lt; 0) { return; }  // Not opened.<br></td></tr
><tr
id=sl_svn4747_446

><td class="source">          for (var i = stack.length; --i &gt; index;) {<br></td></tr
><tr
id=sl_svn4747_447

><td class="source">            var stackEl = stack[i];<br></td></tr
><tr
id=sl_svn4747_448

><td class="source">            if (!(html4.ELEMENTS[stackEl] &amp;<br></td></tr
><tr
id=sl_svn4747_449

><td class="source">                  html4.eflags.OPTIONAL_ENDTAG)) {<br></td></tr
><tr
id=sl_svn4747_450

><td class="source">              out.push(&#39;&lt;/&#39;, stackEl, &#39;&gt;&#39;);<br></td></tr
><tr
id=sl_svn4747_451

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_452

><td class="source">          }<br></td></tr
><tr
id=sl_svn4747_453

><td class="source">          stack.length = index;<br></td></tr
><tr
id=sl_svn4747_454

><td class="source">          out.push(&#39;&lt;/&#39;, tagName, &#39;&gt;&#39;);<br></td></tr
><tr
id=sl_svn4747_455

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_456

><td class="source">      },<br></td></tr
><tr
id=sl_svn4747_457

><td class="source">      pcdata: function(text, out) {<br></td></tr
><tr
id=sl_svn4747_458

><td class="source">        if (!ignoring) { out.push(text); }<br></td></tr
><tr
id=sl_svn4747_459

><td class="source">      },<br></td></tr
><tr
id=sl_svn4747_460

><td class="source">      rcdata: function(text, out) {<br></td></tr
><tr
id=sl_svn4747_461

><td class="source">        if (!ignoring) { out.push(text); }<br></td></tr
><tr
id=sl_svn4747_462

><td class="source">      },<br></td></tr
><tr
id=sl_svn4747_463

><td class="source">      cdata: function(text, out) {<br></td></tr
><tr
id=sl_svn4747_464

><td class="source">        if (!ignoring) { out.push(text); }<br></td></tr
><tr
id=sl_svn4747_465

><td class="source">      },<br></td></tr
><tr
id=sl_svn4747_466

><td class="source">      endDoc: function(out) {<br></td></tr
><tr
id=sl_svn4747_467

><td class="source">        for (var i = stack.length; --i &gt;= 0;) {<br></td></tr
><tr
id=sl_svn4747_468

><td class="source">          out.push(&#39;&lt;/&#39;, stack[i], &#39;&gt;&#39;);<br></td></tr
><tr
id=sl_svn4747_469

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_470

><td class="source">        stack.length = 0;<br></td></tr
><tr
id=sl_svn4747_471

><td class="source">      }<br></td></tr
><tr
id=sl_svn4747_472

><td class="source">    });<br></td></tr
><tr
id=sl_svn4747_473

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_474

><td class="source"><br></td></tr
><tr
id=sl_svn4747_475

><td class="source">  // From RFC3986<br></td></tr
><tr
id=sl_svn4747_476

><td class="source">  var URI_SCHEME_RE = new RegExp(<br></td></tr
><tr
id=sl_svn4747_477

><td class="source">      &#39;^&#39; +<br></td></tr
><tr
id=sl_svn4747_478

><td class="source">      &#39;(?:&#39; +<br></td></tr
><tr
id=sl_svn4747_479

><td class="source">        &#39;([^:\/?#]+)&#39; +         // scheme<br></td></tr
><tr
id=sl_svn4747_480

><td class="source">      &#39;:)?&#39;<br></td></tr
><tr
id=sl_svn4747_481

><td class="source">  );<br></td></tr
><tr
id=sl_svn4747_482

><td class="source"><br></td></tr
><tr
id=sl_svn4747_483

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_484

><td class="source">   * Sanitizes attributes on an HTML tag.<br></td></tr
><tr
id=sl_svn4747_485

><td class="source">   * @param {string} tagName An HTML tag name in lowercase.<br></td></tr
><tr
id=sl_svn4747_486

><td class="source">   * @param {Array.&lt;?string&gt;} attribs An array of alternating names and values.<br></td></tr
><tr
id=sl_svn4747_487

><td class="source">   * @param {?function(?string): ?string} opt_uriPolicy A transform to apply to<br></td></tr
><tr
id=sl_svn4747_488

><td class="source">   *     URI attributes; it can return a new string value, or null to delete<br></td></tr
><tr
id=sl_svn4747_489

><td class="source">   *     the attribute.  If unspecified, URI attributes are deleted.<br></td></tr
><tr
id=sl_svn4747_490

><td class="source">   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply<br></td></tr
><tr
id=sl_svn4747_491

><td class="source">   *     to attributes containing HTML names, element IDs, and space-separated<br></td></tr
><tr
id=sl_svn4747_492

><td class="source">   *     lists of classes; it can return a new string value, or null to delete<br></td></tr
><tr
id=sl_svn4747_493

><td class="source">   *     the attribute.  If unspecified, these attributes are kept unchanged.<br></td></tr
><tr
id=sl_svn4747_494

><td class="source">   * @return {Array.&lt;?string&gt;} The sanitized attributes as a list of alternating<br></td></tr
><tr
id=sl_svn4747_495

><td class="source">   *     names and values, where a null value means to omit the attribute.<br></td></tr
><tr
id=sl_svn4747_496

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_497

><td class="source">  function sanitizeAttribs(tagName, attribs, opt_uriPolicy, opt_nmTokenPolicy) {<br></td></tr
><tr
id=sl_svn4747_498

><td class="source">    for (var i = 0; i &lt; attribs.length; i += 2) {<br></td></tr
><tr
id=sl_svn4747_499

><td class="source">      var attribName = attribs[i];<br></td></tr
><tr
id=sl_svn4747_500

><td class="source">      var value = attribs[i + 1];<br></td></tr
><tr
id=sl_svn4747_501

><td class="source">      var atype = null, attribKey;<br></td></tr
><tr
id=sl_svn4747_502

><td class="source">      if ((attribKey = tagName + &#39;::&#39; + attribName,<br></td></tr
><tr
id=sl_svn4747_503

><td class="source">           html4.ATTRIBS.hasOwnProperty(attribKey)) ||<br></td></tr
><tr
id=sl_svn4747_504

><td class="source">          (attribKey = &#39;*::&#39; + attribName,<br></td></tr
><tr
id=sl_svn4747_505

><td class="source">           html4.ATTRIBS.hasOwnProperty(attribKey))) {<br></td></tr
><tr
id=sl_svn4747_506

><td class="source">        atype = html4.ATTRIBS[attribKey];<br></td></tr
><tr
id=sl_svn4747_507

><td class="source">      }<br></td></tr
><tr
id=sl_svn4747_508

><td class="source">      if (atype !== null) {<br></td></tr
><tr
id=sl_svn4747_509

><td class="source">        switch (atype) {<br></td></tr
><tr
id=sl_svn4747_510

><td class="source">          case html4.atype.NONE: break;<br></td></tr
><tr
id=sl_svn4747_511

><td class="source">          case html4.atype.SCRIPT:<br></td></tr
><tr
id=sl_svn4747_512

><td class="source">          case html4.atype.STYLE:<br></td></tr
><tr
id=sl_svn4747_513

><td class="source">            value = null;<br></td></tr
><tr
id=sl_svn4747_514

><td class="source">            break;<br></td></tr
><tr
id=sl_svn4747_515

><td class="source">          case html4.atype.ID:<br></td></tr
><tr
id=sl_svn4747_516

><td class="source">          case html4.atype.IDREF:<br></td></tr
><tr
id=sl_svn4747_517

><td class="source">          case html4.atype.IDREFS:<br></td></tr
><tr
id=sl_svn4747_518

><td class="source">          case html4.atype.GLOBAL_NAME:<br></td></tr
><tr
id=sl_svn4747_519

><td class="source">          case html4.atype.LOCAL_NAME:<br></td></tr
><tr
id=sl_svn4747_520

><td class="source">          case html4.atype.CLASSES:<br></td></tr
><tr
id=sl_svn4747_521

><td class="source">            value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;<br></td></tr
><tr
id=sl_svn4747_522

><td class="source">            break;<br></td></tr
><tr
id=sl_svn4747_523

><td class="source">          case html4.atype.URI:<br></td></tr
><tr
id=sl_svn4747_524

><td class="source">            var parsedUri = (&#39;&#39; + value).match(URI_SCHEME_RE);<br></td></tr
><tr
id=sl_svn4747_525

><td class="source">            if (!parsedUri) {<br></td></tr
><tr
id=sl_svn4747_526

><td class="source">              value = null;<br></td></tr
><tr
id=sl_svn4747_527

><td class="source">            } else if (!parsedUri[1] ||<br></td></tr
><tr
id=sl_svn4747_528

><td class="source">                WHITELISTED_SCHEMES.test(parsedUri[1])) {<br></td></tr
><tr
id=sl_svn4747_529

><td class="source">              value = opt_uriPolicy ? opt_uriPolicy(value) : null;<br></td></tr
><tr
id=sl_svn4747_530

><td class="source">            } else {<br></td></tr
><tr
id=sl_svn4747_531

><td class="source">              value = null;<br></td></tr
><tr
id=sl_svn4747_532

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_533

><td class="source">            break;<br></td></tr
><tr
id=sl_svn4747_534

><td class="source">          case html4.atype.URI_FRAGMENT:<br></td></tr
><tr
id=sl_svn4747_535

><td class="source">            if (value &amp;&amp; &#39;#&#39; === value.charAt(0)) {<br></td></tr
><tr
id=sl_svn4747_536

><td class="source">              value = value.substring(1);  // remove the leading &#39;#&#39;<br></td></tr
><tr
id=sl_svn4747_537

><td class="source">              value = opt_nmTokenPolicy ? opt_nmTokenPolicy(value) : value;<br></td></tr
><tr
id=sl_svn4747_538

><td class="source">              if (value !== null &amp;&amp; value !== void 0) {<br></td></tr
><tr
id=sl_svn4747_539

><td class="source">                value = &#39;#&#39; + value;  // restore the leading &#39;#&#39;<br></td></tr
><tr
id=sl_svn4747_540

><td class="source">              }<br></td></tr
><tr
id=sl_svn4747_541

><td class="source">            } else {<br></td></tr
><tr
id=sl_svn4747_542

><td class="source">              value = null;<br></td></tr
><tr
id=sl_svn4747_543

><td class="source">            }<br></td></tr
><tr
id=sl_svn4747_544

><td class="source">            break;<br></td></tr
><tr
id=sl_svn4747_545

><td class="source">          default:<br></td></tr
><tr
id=sl_svn4747_546

><td class="source">            value = null;<br></td></tr
><tr
id=sl_svn4747_547

><td class="source">            break;<br></td></tr
><tr
id=sl_svn4747_548

><td class="source">        }<br></td></tr
><tr
id=sl_svn4747_549

><td class="source">      } else {<br></td></tr
><tr
id=sl_svn4747_550

><td class="source">        value = null;<br></td></tr
><tr
id=sl_svn4747_551

><td class="source">      }<br></td></tr
><tr
id=sl_svn4747_552

><td class="source">      attribs[i + 1] = value;<br></td></tr
><tr
id=sl_svn4747_553

><td class="source">    }<br></td></tr
><tr
id=sl_svn4747_554

><td class="source">    return attribs;<br></td></tr
><tr
id=sl_svn4747_555

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_556

><td class="source"><br></td></tr
><tr
id=sl_svn4747_557

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_558

><td class="source">   * Creates a tag policy that omits all tags marked UNSAFE in html4-defs.js<br></td></tr
><tr
id=sl_svn4747_559

><td class="source">   * and applies the default attribute sanitizer with the supplied policy for<br></td></tr
><tr
id=sl_svn4747_560

><td class="source">   * URI attributes and NMTOKEN attributes.<br></td></tr
><tr
id=sl_svn4747_561

><td class="source">   * @param {?function(?string): ?string} opt_uriPolicy A transform to apply to<br></td></tr
><tr
id=sl_svn4747_562

><td class="source">   *     URI attributes.  If not given, URI attributes are deleted.<br></td></tr
><tr
id=sl_svn4747_563

><td class="source">   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply<br></td></tr
><tr
id=sl_svn4747_564

><td class="source">   *     to attributes containing HTML names, element IDs, and space-separated<br></td></tr
><tr
id=sl_svn4747_565

><td class="source">   *     lists of classes.  If not given, such attributes are left unchanged.<br></td></tr
><tr
id=sl_svn4747_566

><td class="source">   * @return {function(string, Array.&lt;?string&gt;)} A tagPolicy suitable for<br></td></tr
><tr
id=sl_svn4747_567

><td class="source">   *     passing to html.sanitize.<br></td></tr
><tr
id=sl_svn4747_568

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_569

><td class="source">  function makeTagPolicy(opt_uriPolicy, opt_nmTokenPolicy) {<br></td></tr
><tr
id=sl_svn4747_570

><td class="source">    return function(tagName, attribs) {<br></td></tr
><tr
id=sl_svn4747_571

><td class="source">      if (!(html4.ELEMENTS[tagName] &amp; html4.eflags.UNSAFE)) {<br></td></tr
><tr
id=sl_svn4747_572

><td class="source">        return sanitizeAttribs(<br></td></tr
><tr
id=sl_svn4747_573

><td class="source">            tagName, attribs, opt_uriPolicy, opt_nmTokenPolicy);<br></td></tr
><tr
id=sl_svn4747_574

><td class="source">      }<br></td></tr
><tr
id=sl_svn4747_575

><td class="source">    };<br></td></tr
><tr
id=sl_svn4747_576

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_577

><td class="source"><br></td></tr
><tr
id=sl_svn4747_578

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_579

><td class="source">   * Sanitizes HTML tags and attributes according to a given policy.<br></td></tr
><tr
id=sl_svn4747_580

><td class="source">   * @param {string} inputHtml The HTML to sanitize.<br></td></tr
><tr
id=sl_svn4747_581

><td class="source">   * @param {function(string, Array.&lt;?string&gt;)} tagPolicy A function that<br></td></tr
><tr
id=sl_svn4747_582

><td class="source">   *     decides which tags to accept and sanitizes their attributes (see<br></td></tr
><tr
id=sl_svn4747_583

><td class="source">   *     makeHtmlSanitizer above for details).<br></td></tr
><tr
id=sl_svn4747_584

><td class="source">   * @return {string} The sanitized HTML.<br></td></tr
><tr
id=sl_svn4747_585

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_586

><td class="source">  function sanitizeWithPolicy(inputHtml, tagPolicy) {<br></td></tr
><tr
id=sl_svn4747_587

><td class="source">    var outputArray = [];<br></td></tr
><tr
id=sl_svn4747_588

><td class="source">    makeHtmlSanitizer(tagPolicy)(inputHtml, outputArray);<br></td></tr
><tr
id=sl_svn4747_589

><td class="source">    return outputArray.join(&#39;&#39;);<br></td></tr
><tr
id=sl_svn4747_590

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_591

><td class="source"><br></td></tr
><tr
id=sl_svn4747_592

><td class="source">  /**<br></td></tr
><tr
id=sl_svn4747_593

><td class="source">   * Strips unsafe tags and attributes from HTML.<br></td></tr
><tr
id=sl_svn4747_594

><td class="source">   * @param {string} inputHtml The HTML to sanitize.<br></td></tr
><tr
id=sl_svn4747_595

><td class="source">   * @param {?function(?string): ?string} opt_uriPolicy A transform to apply to<br></td></tr
><tr
id=sl_svn4747_596

><td class="source">   *     URI attributes.  If not given, URI attributes are deleted.<br></td></tr
><tr
id=sl_svn4747_597

><td class="source">   * @param {function(?string): ?string} opt_nmTokenPolicy A transform to apply<br></td></tr
><tr
id=sl_svn4747_598

><td class="source">   *     to attributes containing HTML names, element IDs, and space-separated<br></td></tr
><tr
id=sl_svn4747_599

><td class="source">   *     lists of classes.  If not given, such attributes are left unchanged.<br></td></tr
><tr
id=sl_svn4747_600

><td class="source">   */<br></td></tr
><tr
id=sl_svn4747_601

><td class="source">  function sanitize(inputHtml, opt_uriPolicy, opt_nmTokenPolicy) {<br></td></tr
><tr
id=sl_svn4747_602

><td class="source">    var tagPolicy = makeTagPolicy(opt_uriPolicy, opt_nmTokenPolicy);<br></td></tr
><tr
id=sl_svn4747_603

><td class="source">    return sanitizeWithPolicy(inputHtml, tagPolicy);<br></td></tr
><tr
id=sl_svn4747_604

><td class="source">  }<br></td></tr
><tr
id=sl_svn4747_605

><td class="source"><br></td></tr
><tr
id=sl_svn4747_606

><td class="source">  return {<br></td></tr
><tr
id=sl_svn4747_607

><td class="source">    escapeAttrib: escapeAttrib,<br></td></tr
><tr
id=sl_svn4747_608

><td class="source">    makeHtmlSanitizer: makeHtmlSanitizer,<br></td></tr
><tr
id=sl_svn4747_609

><td class="source">    makeSaxParser: makeSaxParser,<br></td></tr
><tr
id=sl_svn4747_610

><td class="source">    makeTagPolicy: makeTagPolicy,<br></td></tr
><tr
id=sl_svn4747_611

><td class="source">    normalizeRCData: normalizeRCData,<br></td></tr
><tr
id=sl_svn4747_612

><td class="source">    sanitize: sanitize,<br></td></tr
><tr
id=sl_svn4747_613

><td class="source">    sanitizeAttribs: sanitizeAttribs,<br></td></tr
><tr
id=sl_svn4747_614

><td class="source">    sanitizeWithPolicy: sanitizeWithPolicy,<br></td></tr
><tr
id=sl_svn4747_615

><td class="source">    unescapeEntities: unescapeEntities<br></td></tr
><tr
id=sl_svn4747_616

><td class="source">  };<br></td></tr
><tr
id=sl_svn4747_617

><td class="source">})(html4);<br></td></tr
><tr
id=sl_svn4747_618

><td class="source"><br></td></tr
><tr
id=sl_svn4747_619

><td class="source">var html_sanitize = html.sanitize;<br></td></tr
><tr
id=sl_svn4747_620

><td class="source"><br></td></tr
><tr
id=sl_svn4747_621

><td class="source">// Exports for closure compiler.  Note this file is also cajoled<br></td></tr
><tr
id=sl_svn4747_622

><td class="source">// for domado and run in an environment without &#39;window&#39;<br></td></tr
><tr
id=sl_svn4747_623

><td class="source">if (typeof window !== &#39;undefined&#39;) {<br></td></tr
><tr
id=sl_svn4747_624

><td class="source">  window[&#39;html&#39;] = html;<br></td></tr
><tr
id=sl_svn4747_625

><td class="source">  window[&#39;html_sanitize&#39;] = html_sanitize;<br></td></tr
><tr
id=sl_svn4747_626

><td class="source">}<br></td></tr
></table></pre>
<pre><table width="100%"><tr class="cursor_stop cursor_hidden"><td></td></tr></table></pre>
</td>
</tr></table>

 
<script type="text/javascript">
 var lineNumUnderMouse = -1;
 
 function gutterOver(num) {
 gutterOut();
 var newTR = document.getElementById('gr_svn4747_' + num);
 if (newTR) {
 newTR.className = 'undermouse';
 }
 lineNumUnderMouse = num;
 }
 function gutterOut() {
 if (lineNumUnderMouse != -1) {
 var oldTR = document.getElementById(
 'gr_svn4747_' + lineNumUnderMouse);
 if (oldTR) {
 oldTR.className = '';
 }
 lineNumUnderMouse = -1;
 }
 }
 var numsGenState = {table_base_id: 'nums_table_'};
 var srcGenState = {table_base_id: 'src_table_'};
 var alignerRunning = false;
 var startOver = false;
 function setLineNumberHeights() {
 if (alignerRunning) {
 startOver = true;
 return;
 }
 numsGenState.chunk_id = 0;
 numsGenState.table = document.getElementById('nums_table_0');
 numsGenState.row_num = 0;
 if (!numsGenState.table) {
 return; // Silently exit if no file is present.
 }
 srcGenState.chunk_id = 0;
 srcGenState.table = document.getElementById('src_table_0');
 srcGenState.row_num = 0;
 alignerRunning = true;
 continueToSetLineNumberHeights();
 }
 function rowGenerator(genState) {
 if (genState.row_num < genState.table.rows.length) {
 var currentRow = genState.table.rows[genState.row_num];
 genState.row_num++;
 return currentRow;
 }
 var newTable = document.getElementById(
 genState.table_base_id + (genState.chunk_id + 1));
 if (newTable) {
 genState.chunk_id++;
 genState.row_num = 0;
 genState.table = newTable;
 return genState.table.rows[0];
 }
 return null;
 }
 var MAX_ROWS_PER_PASS = 1000;
 function continueToSetLineNumberHeights() {
 var rowsInThisPass = 0;
 var numRow = 1;
 var srcRow = 1;
 while (numRow && srcRow && rowsInThisPass < MAX_ROWS_PER_PASS) {
 numRow = rowGenerator(numsGenState);
 srcRow = rowGenerator(srcGenState);
 rowsInThisPass++;
 if (numRow && srcRow) {
 if (numRow.offsetHeight != srcRow.offsetHeight) {
 numRow.firstChild.style.height = srcRow.offsetHeight + 'px';
 }
 }
 }
 if (rowsInThisPass >= MAX_ROWS_PER_PASS) {
 setTimeout(continueToSetLineNumberHeights, 10);
 } else {
 alignerRunning = false;
 if (startOver) {
 startOver = false;
 setTimeout(setLineNumberHeights, 500);
 }
 }
 }
 function initLineNumberHeights() {
 // Do 2 complete passes, because there can be races
 // between this code and prettify.
 startOver = true;
 setTimeout(setLineNumberHeights, 250);
 window.onresize = setLineNumberHeights;
 }
 initLineNumberHeights();
</script>

 
 
 <div id="log">
 <div style="text-align:right">
 <a class="ifCollapse" href="#" onclick="_toggleMeta(this); return false">Show details</a>
 <a class="ifExpand" href="#" onclick="_toggleMeta(this); return false">Hide details</a>
 </div>
 <div class="ifExpand">
 
 
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="changelog">
 <p>Change log</p>
 <div>
 <a href="/p/google-caja/source/detail?spec=svn4747&amp;r=4658">r4658</a>
 by mikesamuel
 on Nov 4, 2011
 &nbsp; <a href="/p/google-caja/source/diff?spec=svn4747&r=4658&amp;format=side&amp;path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old_path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old=4631">Diff</a>
 </div>
 <pre>Copy of Ka-Ping's html sanitizer patch.
<a href="http://codereview.appspot.com/5305081" rel="nofollow">http://codereview.appspot.com/5305081</a>

I LGTMed this at
<a href="http://codereview.appspot.com/4641064/" rel="nofollow">http://codereview.appspot.com/4641064/</a>

Issue 4641064: Factor out a replaceable
tagPolicy to enable customization of the
sanitizer.

This exposes a hook named 'tagPolicy' in
the sanitizer so that the
...</pre>
 </div>
 
 
 
 
 
 
 <script type="text/javascript">
 var detail_url = '/p/google-caja/source/detail?r=4658&spec=svn4747';
 var publish_url = '/p/google-caja/source/detail?r=4658&spec=svn4747#publish';
 // describe the paths of this revision in javascript.
 var changed_paths = [];
 var changed_urls = [];
 
 changed_paths.push('/trunk/src/com/google/caja/ancillary/linter/Linter.java');
 changed_urls.push('/p/google-caja/source/browse/trunk/src/com/google/caja/ancillary/linter/Linter.java?r\x3d4658\x26spec\x3dsvn4747');
 
 
 changed_paths.push('/trunk/src/com/google/caja/plugin/html-sanitizer.js');
 changed_urls.push('/p/google-caja/source/browse/trunk/src/com/google/caja/plugin/html-sanitizer.js?r\x3d4658\x26spec\x3dsvn4747');
 
 var selected_path = '/trunk/src/com/google/caja/plugin/html-sanitizer.js';
 
 
 changed_paths.push('/trunk/tests/com/google/caja/plugin/es53-test-domado-special-guest.html');
 changed_urls.push('/p/google-caja/source/browse/trunk/tests/com/google/caja/plugin/es53-test-domado-special-guest.html?r\x3d4658\x26spec\x3dsvn4747');
 
 
 changed_paths.push('/trunk/tests/com/google/caja/plugin/html-sanitizer-test.js');
 changed_urls.push('/p/google-caja/source/browse/trunk/tests/com/google/caja/plugin/html-sanitizer-test.js?r\x3d4658\x26spec\x3dsvn4747');
 
 
 function getCurrentPageIndex() {
 for (var i = 0; i < changed_paths.length; i++) {
 if (selected_path == changed_paths[i]) {
 return i;
 }
 }
 }
 function getNextPage() {
 var i = getCurrentPageIndex();
 if (i < changed_paths.length - 1) {
 return changed_urls[i + 1];
 }
 return null;
 }
 function getPreviousPage() {
 var i = getCurrentPageIndex();
 if (i > 0) {
 return changed_urls[i - 1];
 }
 return null;
 }
 function gotoNextPage() {
 var page = getNextPage();
 if (!page) {
 page = detail_url;
 }
 window.location = page;
 }
 function gotoPreviousPage() {
 var page = getPreviousPage();
 if (!page) {
 page = detail_url;
 }
 window.location = page;
 }
 function gotoDetailPage() {
 window.location = detail_url;
 }
 function gotoPublishPage() {
 window.location = publish_url;
 }
</script>

 
 <style type="text/css">
 #review_nav {
 border-top: 3px solid white;
 padding-top: 6px;
 margin-top: 1em;
 }
 #review_nav td {
 vertical-align: middle;
 }
 #review_nav select {
 margin: .5em 0;
 }
 </style>
 <div id="review_nav">
 <table><tr><td>Go to:&nbsp;</td><td>
 <select name="files_in_rev" onchange="window.location=this.value">
 
 <option value="/p/google-caja/source/browse/trunk/src/com/google/caja/ancillary/linter/Linter.java?r=4658&amp;spec=svn4747"
 
 >...aja/ancillary/linter/Linter.java</option>
 
 <option value="/p/google-caja/source/browse/trunk/src/com/google/caja/plugin/html-sanitizer.js?r=4658&amp;spec=svn4747"
 selected="selected"
 >...le/caja/plugin/html-sanitizer.js</option>
 
 <option value="/p/google-caja/source/browse/trunk/tests/com/google/caja/plugin/es53-test-domado-special-guest.html?r=4658&amp;spec=svn4747"
 
 >...3-test-domado-special-guest.html</option>
 
 <option value="/p/google-caja/source/browse/trunk/tests/com/google/caja/plugin/html-sanitizer-test.js?r=4658&amp;spec=svn4747"
 
 >...ja/plugin/html-sanitizer-test.js</option>
 
 </select>
 </td></tr></table>
 
 
 



 <div style="white-space:nowrap">
 Project members,
 <a href="https://www.google.com/accounts/ServiceLogin?service=code&amp;ltmpl=phosting&amp;continue=http%3A%2F%2Fcode.google.com%2Fp%2Fgoogle-caja%2Fsource%2Fbrowse%2Ftrunk%2Fsrc%2Fcom%2Fgoogle%2Fcaja%2Fplugin%2Fhtml-sanitizer.js&amp;followup=http%3A%2F%2Fcode.google.com%2Fp%2Fgoogle-caja%2Fsource%2Fbrowse%2Ftrunk%2Fsrc%2Fcom%2Fgoogle%2Fcaja%2Fplugin%2Fhtml-sanitizer.js"
 >sign in</a> to write a code review</div>


 
 </div>
 
 
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="older_bubble">
 <p>Older revisions</p>
 
 
 <div class="closed" style="margin-bottom:3px;" >
 <img class="ifClosed" onclick="_toggleHidden(this)" src="http://www.gstatic.com/codesite/ph/images/plus.gif" >
 <img class="ifOpened" onclick="_toggleHidden(this)" src="http://www.gstatic.com/codesite/ph/images/minus.gif" >
 <a href="/p/google-caja/source/detail?spec=svn4747&r=4631">r4631</a>
 by felix8a
 on Sep 15, 2011
 &nbsp; <a href="/p/google-caja/source/diff?spec=svn4747&r=4631&amp;format=side&amp;path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old_path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old=4627">Diff</a>
 <br>
 <pre class="ifOpened">fix domado break
<a href="http://codereview.appspot.com/5030046" rel="nofollow">http://codereview.appspot.com/5030046</a>

recent change to html-sanitizer.js for
Closure:
...</pre>
 </div>
 
 <div class="closed" style="margin-bottom:3px;" >
 <img class="ifClosed" onclick="_toggleHidden(this)" src="http://www.gstatic.com/codesite/ph/images/plus.gif" >
 <img class="ifOpened" onclick="_toggleHidden(this)" src="http://www.gstatic.com/codesite/ph/images/minus.gif" >
 <a href="/p/google-caja/source/detail?spec=svn4747&r=4627">r4627</a>
 by ihab.awad
 on Sep 14, 2011
 &nbsp; <a href="/p/google-caja/source/diff?spec=svn4747&r=4627&amp;format=side&amp;path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old_path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old=4626">Diff</a>
 <br>
 <pre class="ifOpened">Change 'override' to 'overrides'
<a href="http://codereview.appspot.com/5011048" rel="nofollow">http://codereview.appspot.com/5011048</a>



...</pre>
 </div>
 
 <div class="closed" style="margin-bottom:3px;" >
 <img class="ifClosed" onclick="_toggleHidden(this)" src="http://www.gstatic.com/codesite/ph/images/plus.gif" >
 <img class="ifOpened" onclick="_toggleHidden(this)" src="http://www.gstatic.com/codesite/ph/images/minus.gif" >
 <a href="/p/google-caja/source/detail?spec=svn4747&r=4626">r4626</a>
 by jasvir
 on Sep 14, 2011
 &nbsp; <a href="/p/google-caja/source/diff?spec=svn4747&r=4626&amp;format=side&amp;path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old_path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&amp;old=4594">Diff</a>
 <br>
 <pre class="ifOpened">Issue 5011047
<a href="http://codereview.appspot.com/5011047" rel="nofollow">http://codereview.appspot.com/5011047</a>
Closure compiler optimizes away
html_sanitize too aggressively

...</pre>
 </div>
 
 
 <a href="/p/google-caja/source/list?path=/trunk/src/com/google/caja/plugin/html-sanitizer.js&start=4658">All revisions of this file</a>
 </div>
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 
 <div class="pmeta_bubble_bg" style="border:1px solid white">
 <div class="round4"></div>
 <div class="round2"></div>
 <div class="round1"></div>
 <div class="box-inner">
 <div id="fileinfo_bubble">
 <p>File info</p>
 
 <div>Size: 21847 bytes,
 626 lines</div>
 
 <div><a href="//google-caja.googlecode.com/svn/trunk/src/com/google/caja/plugin/html-sanitizer.js">View raw file</a></div>
 </div>
 
 <div id="props">
 <p>File properties</p>
 <dl>
 
 <dt>svn:mime-type</dt>
 <dd>text/javascript;charset=UTF-8</dd>
 
 </dl>
 </div>
 
 </div>
 <div class="round1"></div>
 <div class="round2"></div>
 <div class="round4"></div>
 </div>
 </div>
 </div>


</div>

</div>
</div>

<script src="http://www.gstatic.com/codesite/ph/1847340689237817661/js/prettify/prettify.js"></script>
<script type="text/javascript">prettyPrint();</script>


<script src="http://www.gstatic.com/codesite/ph/1847340689237817661/js/source_file_scripts.js"></script>

 <script type="text/javascript" src="https://kibbles.googlecode.com/files/kibbles-1.3.3.comp.js"></script>
 <script type="text/javascript">
 var lastStop = null;
 var initialized = false;
 
 function updateCursor(next, prev) {
 if (prev && prev.element) {
 prev.element.className = 'cursor_stop cursor_hidden';
 }
 if (next && next.element) {
 next.element.className = 'cursor_stop cursor';
 lastStop = next.index;
 }
 }
 
 function pubRevealed(data) {
 updateCursorForCell(data.cellId, 'cursor_stop cursor_hidden');
 if (initialized) {
 reloadCursors();
 }
 }
 
 function draftRevealed(data) {
 updateCursorForCell(data.cellId, 'cursor_stop cursor_hidden');
 if (initialized) {
 reloadCursors();
 }
 }
 
 function draftDestroyed(data) {
 updateCursorForCell(data.cellId, 'nocursor');
 if (initialized) {
 reloadCursors();
 }
 }
 function reloadCursors() {
 kibbles.skipper.reset();
 loadCursors();
 if (lastStop != null) {
 kibbles.skipper.setCurrentStop(lastStop);
 }
 }
 // possibly the simplest way to insert any newly added comments
 // is to update the class of the corresponding cursor row,
 // then refresh the entire list of rows.
 function updateCursorForCell(cellId, className) {
 var cell = document.getElementById(cellId);
 // we have to go two rows back to find the cursor location
 var row = getPreviousElement(cell.parentNode);
 row.className = className;
 }
 // returns the previous element, ignores text nodes.
 function getPreviousElement(e) {
 var element = e.previousSibling;
 if (element.nodeType == 3) {
 element = element.previousSibling;
 }
 if (element && element.tagName) {
 return element;
 }
 }
 function loadCursors() {
 // register our elements with skipper
 var elements = CR_getElements('*', 'cursor_stop');
 var len = elements.length;
 for (var i = 0; i < len; i++) {
 var element = elements[i]; 
 element.className = 'cursor_stop cursor_hidden';
 kibbles.skipper.append(element);
 }
 }
 function toggleComments() {
 CR_toggleCommentDisplay();
 reloadCursors();
 }
 function keysOnLoadHandler() {
 // setup skipper
 kibbles.skipper.addStopListener(
 kibbles.skipper.LISTENER_TYPE.PRE, updateCursor);
 // Set the 'offset' option to return the middle of the client area
 // an option can be a static value, or a callback
 kibbles.skipper.setOption('padding_top', 50);
 // Set the 'offset' option to return the middle of the client area
 // an option can be a static value, or a callback
 kibbles.skipper.setOption('padding_bottom', 100);
 // Register our keys
 kibbles.skipper.addFwdKey("n");
 kibbles.skipper.addRevKey("p");
 kibbles.keys.addKeyPressListener(
 'u', function() { window.location = detail_url; });
 kibbles.keys.addKeyPressListener(
 'r', function() { window.location = detail_url + '#publish'; });
 
 kibbles.keys.addKeyPressListener('j', gotoNextPage);
 kibbles.keys.addKeyPressListener('k', gotoPreviousPage);
 
 
 }
 </script>
<script src="http://www.gstatic.com/codesite/ph/1847340689237817661/js/code_review_scripts.js"></script>
<script type="text/javascript">
 function showPublishInstructions() {
 var element = document.getElementById('review_instr');
 if (element) {
 element.className = 'opened';
 }
 }
 var codereviews;
 function revsOnLoadHandler() {
 // register our source container with the commenting code
 var paths = {'svn4747': '/trunk/src/com/google/caja/plugin/html-sanitizer.js'}
 codereviews = CR_controller.setup(
 {"profileUrl":null,"token":null,"assetHostPath":"http://www.gstatic.com/codesite/ph","domainName":null,"assetVersionPath":"http://www.gstatic.com/codesite/ph/1847340689237817661","projectHomeUrl":"/p/google-caja","relativeBaseUrl":"","projectName":"google-caja","loggedInUserEmail":null}, '', 'svn4747', paths,
 CR_BrowseIntegrationFactory);
 
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_DRAFT_PLATE, showPublishInstructions);
 
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_PUB_PLATE, pubRevealed);
 codereviews.registerActivityListener(CR_ActivityType.REVEAL_DRAFT_PLATE, draftRevealed);
 codereviews.registerActivityListener(CR_ActivityType.DISCARD_DRAFT_COMMENT, draftDestroyed);
 
 
 
 
 
 
 
 var initialized = true;
 reloadCursors();
 }
 window.onload = function() {keysOnLoadHandler(); revsOnLoadHandler();};

</script>
<script type="text/javascript" src="http://www.gstatic.com/codesite/ph/1847340689237817661/js/dit_scripts.js"></script>

 
 
 
 <script type="text/javascript" src="http://www.gstatic.com/codesite/ph/1847340689237817661/js/ph_core.js"></script>
 
 
 
 
 <script type="text/javascript" src="/js/codesite_product_dictionary_ph.pack.04102009.js"></script>
</div> 
<div id="footer" dir="ltr">
 <div class="text">
 &copy;2011 Google -
 <a href="/projecthosting/terms.html">Terms</a> -
 <a href="http://www.google.com/privacy.html">Privacy</a> -
 <a href="/p/support/">Project Hosting Help</a>
 </div>
</div>
 <div class="hostedBy" style="margin-top: -20px;">
 <span style="vertical-align: top;">Powered by <a href="http://code.google.com/projecthosting/">Google Project Hosting</a></span>
 </div>
 
 


 
 
 <script type="text/javascript">_CS_reportToCsi();</script>
 
 </body>
</html>

