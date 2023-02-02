import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { parse } from 'yaml'

interface ProgressBarSettings {
  setting: string;
}

const DEFAULT_SETTINGS: ProgressBarSettings = {
  setting: 'default'
}

export default class ProgressBar extends Plugin {
  settings: ProgressBarSettings;

  async onload() {
	// await this.loadSettings();

	// This adds a settings tab so the user can configure various aspects of the plugin
	// this.addSettingTab(new ProgressBarSettingTab(this.app, this));

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

function newError(el: HTMLElement, msg: string) {
  el.createEl("div", { text: 'ProgressBarError: '+msg });
}

const generateUniqueID = (idLength: number) => [...Array(idLength).keys()].map((elem)=>Math.random().toString(36).substr(2, 1)).join("")

function createProgressBar(el: HTMLElement, bar: any) {
  switch (bar.kind) {
    case "day-year":
      return newDayYearProgressBar(el, bar);
    case "day-month":
      return newDayMonthProgressBar(el, bar);
	case "month":
      return newMonthProgressBar(el, bar);
    case "day-week":
      return newDayWeekProgressBar(el, bar);
    default:
      return newProgressBar(el, bar);
  }
}

function daysIntoYear(date: Date){
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function newDayWeekProgressBar(el: HTMLElement, bar: any) {
  bar.max = 7;
  bar.value = new Date().getDay() === 0 ? 7 : new Date().getDay();
  newProgressBar(el, bar);
}

function newMonthProgressBar(el: HTMLElement, bar: any) {
  bar.max = 12;
  bar.value = new Date().getMonth()+1;
  newProgressBar(el, bar);
}

function newDayMonthProgressBar(el: HTMLElement, bar: any) {
  const now = new Date()
  bar.max = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  bar.value = now.getDate();
  newProgressBar(el, bar);
}

function newDayYearProgressBar(el: HTMLElement, bar: any) {
  bar.max = new Date().getFullYear() % 4 == 0 ? 366 : 365;
  bar.value = daysIntoYear(new Date());
  newProgressBar(el, bar);
}

function newProgressBar(el: HTMLElement, bar: any) {
  const labelName = bar.name ? bar.name : bar.kind;
  const label = el.createEl("label", { text: labelName+"("+bar.value+"/"+bar.max+'): ' });

  const progressbar = label.createEl("progress");
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
		.setValue(this.plugin.settings.setting)
		.onChange(async (value) => {
		  console.log('Secret: ' + value);
		  this.plugin.settings.setting = value;
		  await this.plugin.saveSettings();
		}));
  }
}
