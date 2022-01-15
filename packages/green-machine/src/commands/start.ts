import { Arguments, CommandBuilder, string } from 'yargs';
import crypto from 'crypto';
import { existsSync, writeFileSync } from 'fs';
import { GreenMachine } from '..';
// import jwt from 'jsonwebtoken'

type Options = {
	pluginDir: string
	controlUrl: string;
};
  
  export const command: string = 'start';
  export const desc: string = 'Start';
  
  export const builder: CommandBuilder<Options, Options> = (yargs) =>
	yargs
	  .options({
		pluginDir: {type: 'string', description: "Path to plugin directory", default: './plugins'},
		controlUrl: {type: 'string', description: "Control URL", default: 'http://hahei-jumpbox.hexhive.io'},
	  })

  export const handler =  async (argv: Arguments<Options>) => {
	// const {  } = argv;

	const { pluginDir, controlUrl } = argv;

	const screen = new GreenMachine({
		pluginDirectory: pluginDir,
		controlUrl
	});

	await screen.start()

  };