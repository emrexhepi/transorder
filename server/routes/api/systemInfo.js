// import packages
import express from 'express';
import childProcess from 'child_process';
import util from 'util';

// system information
import si from 'systeminformation';

// promisify spawn
const exec = util.promisify(childProcess.exec);
// const spawn = util.promisify(childProcess.spawn);


// declare router
const router = express.Router();

// http get method
router.get('/', async (req, res, next) => {
    try {
        // get cpi info from systeminformation
        const data = {};
        data.cpuTemp = '';
        data.cpuInfo = await si.cpu();

        // get temperatre from file
        const temp = await exec('cat /mnt/d/Intel-Genesis/transcorder/cpu_temp');
        data.cpuTemp = temp.stdout;

        res.json(data);

        // call transcorder from route
        const transcorder = req.app.get('transcorder');
        transcorder.start();
    } catch (e) {
        next(e);
    }
});

export default router;
