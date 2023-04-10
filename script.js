import { exec } from "child_process";



exec(`bash push.sh youssefzahar cus1 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 youssef.zahar@esprit.tn ":cpmmit:"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);

      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);

  })