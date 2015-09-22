import _C from './constant';

let Gene = {
    getAreaType (type) {
        return type === 0 ? _C.MapAreaType['normal'] : _C.MapAreaType['event'];
    },
    getSpeed (speed) {
        return speed === 1 ? 'fixed' : (speed === 5 ? 'slow' : 'fast');
    },
    isPlane (type) {
        let planetypes = [6,7,8,9,10,11];
        for (let v of planetypes) {
            if (type === v) { return true; }
        }
        return false;
    },
    areaType (areatype) {
        return areatype === 0 ? 'normal' : 'event';
    },
    isUnion (sallyflag) {
        if (sallyflag[0] === 0 && sallyflag[1] === 3) {
            return true;
        }
        return false;
    },
    getRank (rank) {
        return rank.toString();
    },
    getAirDominance (type, aa) {
        let ad = 0;
        if ([6,7,8].indexOf(type[3]) >= 0 || (type[3] === 10 && type[2] === 11)) {
            ad = aa;
        }
        return ad;
    },
    getMissionState (mission) {
        let mState = '';
        if (mission === 0) {
            mState = _C.MissionState['none'];
        }
        else if (mission === 1) {
            mState = _C.MissionState['doing'];
        }
        else if (mission === 2) {
            mState = _C.MissionState['complate'];
        }
        return mState;
    }
};

export default Gene;
