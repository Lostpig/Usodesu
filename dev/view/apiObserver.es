import models from '../models/models';
let api = window.remote.require('./dist/libs/api');

api.addListener('start', (query, result) => {
    let apidata = JSON.parse(result).api_data;

    models.getdata('shiptype').update(apidata.api_mst_stype);
    models.getdata('shipinfo').update(apidata.api_mst_ship);

    models.getdata('equiptype').update(apidata.api_mst_slotitem_equiptype);
    models.getdata('soltitem').update(apidata.api_mst_slotitem);

    models.getdata('maparea').update(apidata.api_mst_maparea);
    models.getdata('mapinfo').update(apidata.api_mst_mapinfo);
    models.getdata('mapcell').update(apidata.api_mst_mapcell);

    models.getdata('mission').update(apidata.api_mst_mission);
});
