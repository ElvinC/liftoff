import { stageFromPreset } from './stage';

export function stageListFromString(stageListString) {
    const newStageList = [];
    const lines = stageListString.split('\n');

    try {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // remove spaces before/after
            line = line.replace(/^\s+|\s+$/g, '');
            if (line[0] !== '#' && line !== '') {
                // not a comment
                const splitLine = line.split(' ');
                if (splitLine.length !== 3) {
                    alert(`Wrong number of parameters in line ${i}`);
                    return false;
                }

                const nameEng = splitLine[0];
                const numEng = parseInt(splitLine[1], 10);
                const nameTank = splitLine[2];
                // const numTank = parseInt(splitLine[3], 10);

                if (Number.isNaN(numEng)) { //  || isNaN(numTank)
                    alert(`Can't parse number in line ${i}`);
                    return false;
                }

                const newStage = stageFromPreset(nameEng, numEng, nameTank);

                if (newStage === false) {
                    alert(`Can't generate stage, check spelling on line ${i}`);
                    return false;
                }

                newStageList.push(newStage);
            }
        }
        return newStageList.reverse();
    } catch (err) {
        console.log(`Parse error: ${String(err)}`);
        return false;
    }
}
