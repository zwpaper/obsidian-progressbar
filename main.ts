import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, parseYaml } from 'obsidian';

interface ProgressBarSettings {
  setting: string;
}

const DEFAULT_SETTINGS: ProgressBarSettings = {
  setting: 'default'
}

export default class ProgressBar extends Plugin {
  // settings: ProgressBarSettings;

  async onload() {
    // await this.loadSettings();

    // This adds a settings tab so the user can configure various aspects of the plugin
    // this.addSettingTab(new ProgressBarSettingTab(this.app, this));

    this.registerMarkdownCodeBlockProcessor("progressbar", (source, el, ctx) => {
      const cfg = parseYaml(source);
      if (!cfg.kind && !cfg.value) {
        newError(el, "No kind specified");
        return;
      }

      if (cfg.kind === "day-custom" && !cfg.min && !cfg.max) {
        newError(el, "Must specify min and max for day-custom");
        return;
      }

      createProgressBar(el, cfg);
    });
  }

  onunload() {

  }

  // async loadSettings() {
  //   this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  // }
  //
  // async saveSettings() {
  //   await this.saveData(this.settings);
  // }
}

function newError(el: HTMLElement, msg: string) {
  el.createEl("div", { text: 'ProgressBarError: ' + msg });
}

const generateUniqueID = (idLength: number) => [...Array(idLength).keys()].map((elem) => Math.random().toString(36).substr(2, 1)).join("")

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
    case "day-custom":
      return newDayCustomProgressBar(el, bar);
    default:
      return newProgressBar(el, bar, bar);
  }
}

function daysIntoYear(date: Date) {
  return (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
}

function newDayWeekProgressBar(el: HTMLElement, bar: any) {
  bar.max = 7;
  bar.value = new Date().getDay() === 0 ? 7 : new Date().getDay();
  newProgressBar(el, bar, bar);
}

function newMonthProgressBar(el: HTMLElement, bar: any) {
  bar.max = 12;
  bar.value = new Date().getMonth() + 1;
  newProgressBar(el, bar, bar);
}

function newDayMonthProgressBar(el: HTMLElement, bar: any) {
  const now = new Date()
  bar.max = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  bar.value = now.getDate();
  newProgressBar(el, bar, bar);
}

function newDayYearProgressBar(el: HTMLElement, bar: any) {
  bar.max = new Date().getFullYear() % 4 == 0 ? 366 : 365;
  bar.value = daysIntoYear(new Date());
  newProgressBar(el, bar, bar);
}

// html progressbar has no min variable,
// both max and value should minus min
function newDayCustomProgressBar(el: HTMLElement, bar: any) {
  let val = {
    min: daysIntoYear(new Date(bar.min)),
    max: daysIntoYear(new Date(bar.max)),
    value: daysIntoYear(new Date()),
  }
  val.max = val.max - val.min;
  val.value = val.value - val.min;

  newProgressBar(el, bar, val);
}

interface Templater {
  [index: string]: string;
  max: string;
  value: string;
  percentage: string;
}

function applyTemplate(template: string, data: Templater) {
  const pattern = /{\s*(\w+?)\s*}/g; // {property}
  return template.replace(pattern, (_: any, token: string) => data[token] || "{" + token + "}");
}

function newProgressBar(el: HTMLElement, bar: any, val: any) {
  const labelName = bar.name ? bar.name : bar.kind + "({percentage})";
  const value: string = (Math.floor(bar.value * 10) / 10).toString();
  const message = applyTemplate(labelName, {
    min: bar.min,
    max: bar.max,
    value: value,
    percentage: Math.round(val.value / val.max * 100) + "%",
  });
  const label = el.createEl("label", { text: message + ": " });

  const progressbar = label.createEl("progress");
  progressbar.value = val.value;
  progressbar.max = val.max;
  if (bar.width) {
    progressbar.style.width = bar.width;
  }
}

// class ProgressBarSettingTab extends PluginSettingTab {
//   plugin: ProgressBar;
//
//   constructor(app: App, plugin: ProgressBar) {
//  super(app, plugin);
//  this.plugin = plugin;
//   }
//
//   display(): void {
//  const {containerEl} = this;
//
//  containerEl.empty();
//
//  containerEl.createEl('h2', {text: 'Settings for ProgressBar plugin.'});
//
//  new Setting(containerEl)
//    .setName('TBD')
//    .setDesc('Construction')
//    .addText(text => text
//      .setPlaceholder('Enter your secret')
//      .setValue(this.plugin.settings.setting)
//      .onChange(async (value) => {
//        console.log('Secret: ' + value);
//        this.plugin.settings.setting = value;
//        await this.plugin.saveSettings();
//      }));
//   }
// }
