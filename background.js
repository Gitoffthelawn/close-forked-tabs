/* global browser */

//const temporary = browser.runtime.id.endsWith('@temporary-addon'); // debugging?
const manifest = browser.runtime.getManifest();
const extname = manifest.name;

function getChildren(id,tabs) {
	let children = new Set();
	for (const t of tabs){
		if(t.openerTabId === id) {
			children.add(t.id);
			const tmp =  getChildren(t.id,tabs);
			children = new Set([...children, ...tmp]);
		}
	}
	return children;
}

browser.menus.create({
	id: extname,
	title: extname,
	contexts: ["tab"],
	onclick: async function(info, tab) {
		if(info.menuItemId.startsWith(extname)){
			// close only visible tabs, which are forked from the one selected
			const tabs = await browser.tabs.query({
				hidden: false
			});
			const children = getChildren(tab.id, tabs);
			browser.tabs.remove([...children]);
		}
	}
});

