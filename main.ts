import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { parse } from 'yaml'

// Remember to rename these classes and interfaces!

interface ProgressBarSettings {
	setting: string;
}

const DEFAULT_SETTINGS: ProgressBarSettings = {
	setting: 'default'
}

export default class ProgressBar extends Plugin {
	settings: ProgressBarSettings;

	async onload() {
		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ProgressBarSettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

        this.registerMarkdownCodeBlockProcessor("progressbar", (source, el, ctx) => {
            const cfg = parse(source);
            console.log(cfg);
            if ( !cfg.kind && !cfg.value ) {
               newError(el, "No kind specified");
               return;
            }

            createProgressBar(el, cfg);
        });
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

function newError(el, msg) {
    el.createEl("div", { text: 'ProgressBarError: '+msg });
}

const generateUniqueID = (idLength) => [...Array(idLength).keys()].map((elem)=>Math.random().toString(36).substr(2, 1)).join("")

function createProgressBar(el, bar) {
    switch (bar.kind) {
        case "year":
            return newYearProgressBar(el, bar);
        case "month":
            return newMonthProgressBar(el, bar);
        case "week":
            return newWeekProgressBar(el, bar);
        default:
    }
}

function daysIntoYear(date){
    return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function newYearProgressBar(el, bar) {
    bar.max = new Date().getFullYear() % 4 == 0 ? 366 : 365;
    bar.value = daysIntoYear(new Date());
    console.log(bar)
    newProgressBar(el, bar);
}

function newProgressBar(el, bar) {
    const id = generateUniqueID(10);
    const labelName = bar.name ? bar.name : bar.kind;
    const label = el.createEl("label", { text: labelName+': ' });
    label.for = id;
    const progressbar = el.createEl("progress");
    progressbar.id = id;
    progressbar.value = bar.value;
    progressbar.max = bar.max;
    if ( bar.width ) {
        progressbar.style.width = bar.width;
    }
}

class ProgressBarSettingTab extends PluginSettingTab {
	plugin: ProgressBar;

	constructor(app: App, plugin: ProgressBar) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for ProgressBar plugin.'});

		new Setting(containerEl)
			.setName('TBD')
			.setDesc('Construction')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					console.log('Secret: ' + value);
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
