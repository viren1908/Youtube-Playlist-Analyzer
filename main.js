const puppeteer = require("puppeteer");
const fs = require('fs');

// current Tab
let cTab;
const playlistLink = 'https://youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq';

(async () => {
    try {
        const browserOpen = puppeteer.launch({
            headless: false,
            args: ['--start-maximized'],
            defaultViewport: null
        });

        let browserInstance = await browserOpen
        let allTabsArr = await browserInstance.pages();
        cTab = allTabsArr[0];
        await cTab.goto(playlistLink);

        await cTab.waitForSelector('h1#title');

        let name = await cTab.evaluate(function (select) {
            return document.querySelector(select).innerText;
        }, 'h1#title');
       
        let allData =  await cTab.evaluate(getData,'#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer');
        
        // console.log(name,allData.noOfVideos,allData.noOfViews); 

        let totalVideos = allData.noOfVideos.split(" ")[0]; 
        console.log(totalVideos); 

        // Videos seen on the page currently 
        let currVideos = await getCurrVideosLength();
        // console.log(currVideos);
        
        while(totalVideos - currVideos >= 20){
                await scrollTab()
                currVideos = await getCurrVideosLength();
        }
   
    } catch(error) {

    }

})();

function getData(selector) {
    let allElems = document.querySelectorAll(selector);
    let noOfVideos = allElems[0].innerText;
    let noOfViews = allElems[1].innerText;

    return {
        noOfVideos,
        noOfViews
    }    
}  

async function getCurrVideosLength() {
    let length = await cTab.evaluate(getLength,'#container>#thumbnail span.style-scope.ytd-thumbnail-overlay-time-status-renderer'); 
    return length ; 
} 

async function scrollTab(){
    await cTab.evaluate(goToBottom);
    function goToBottom(){
        window.scrollBy(0, window.innerHeight);     
    }
}

function getLength(durationSelect) {
     let durationElem = document.querySelectorAll(durationSelect);
     return durationElem ;
}