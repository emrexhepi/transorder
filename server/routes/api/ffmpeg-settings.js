// import packages
import express from 'express';


// declare router
const router = express.Router();

// http get method
router.get('/', async (req, res, next) => {
    try {
        const db = req.app.get('db');

        const data = await db.get('settings')
            .filter({ name: 'FFMPEG' });

        res.json(data.value()[0].data);
    } catch (e) {
        next(e);
    }
});

export default router;
