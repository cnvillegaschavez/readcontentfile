import { Component, OnInit } from '@angular/core';
import { locationDto } from "./shared/locationdto";
import { AsEnumerable } from "linq-es5";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    title: string = 'Read Content File';
    message: string = "";
    propertyFile: any = null;
    fileName: string;
    file: any = null;
    dataDepartament: locationDto[] = [];
    dataProvince: locationDto[] = [];
    dataDistrict: locationDto[] = [];

    ngOnInit() {

    }

    fileChanged($event): void {
        this.fileName = this.message = "";
        this.file = (<HTMLInputElement>document.getElementById("file")).files[0];
        if (this.file !== undefined) {
            this.fileName = this.file.name;
            var fileReader = new FileReader();
            fileReader.onload = this.loadData;
            fileReader.readAsText(this.file);
            this.message = "Concluyo la carga del archivo";
        }
        else
            this.onReset();
    }

    loadData(e) {
        const fileData = e.currentTarget.result;
        var lines = fileData.split("\n");
        this.dataDepartament = [];
        this.dataProvince = [];
        this.dataDistrict = [];
        for (let item of lines) {
            var departament = setData(this.dataDepartament, item, 0);
            var province = setData(this.dataProvince, item, 1, departament);
            var dataDistrict = setData(this.dataDistrict, item, 2, province);
        }

        sessionStorage.setItem("dataDepartament", JSON.stringify(this.dataDepartament));
        sessionStorage.setItem("dataProvince", JSON.stringify(this.dataProvince));
        sessionStorage.setItem("dataDistrict", JSON.stringify(this.dataDistrict));
        showDataConsole('DEPARTAMENTO', this.dataDepartament);
        showDataConsole('PROVINCIA', this.dataProvince);
        showDataConsole('DISTRITO', this.dataDistrict);
    }

    public showData() {
        if (sessionStorage.getItem("dataDepartament") != null) {
            this.dataDepartament = JSON.parse(sessionStorage.getItem("dataDepartament"));
            this.dataProvince = JSON.parse(sessionStorage.getItem("dataProvince"));
            this.dataDistrict = JSON.parse(sessionStorage.getItem("dataDistrict"));
        }
        else
            this.message = "Cargue el archivo plano";
    }

    public onReset() {
        this.dataDepartament = [];
        this.dataProvince = [];
        this.dataDistrict = [];
        sessionStorage.removeItem("dataDepartament");
        sessionStorage.removeItem("dataProvince");
        sessionStorage.removeItem("dataDistrict");
        this.propertyFile = null;
        this.file = null;
        this.message = this.fileName = "";
    }

}

function setData(dataCurrent: locationDto[], item: string, index: number, dataParent: locationDto = null): locationDto {
    var itemInfo = item.split('/');
    if (itemInfo.length > 2) {
        var infoDataItem = itemInfo[index].trim();
        var dataItem = infoDataItem.split(' ');
        if (dataItem.length > 1) {
            var data = new locationDto();
            data.code = dataItem[0];
            data.name = infoDataItem.replace(data.code, '').trim();
            data.codeParent = dataParent != null ? dataParent.code : '-';
            data.nameParent = dataParent != null ? dataParent.name : '-';
            if (!AsEnumerable(dataCurrent).Any(r => r.code == data.code))
                dataCurrent.push(data);

            return data;
        }
    }
    return null;
}

function showDataConsole(title: string, data: locationDto[]) {
    console.log(title);
    console.log('Código	  Nombre	  Código Padre	  Descripción Padre');
    for (let item of data) {
        console.log(item.code + '    ' + item.name + '   ' + item.codeParent + '   ' + item.nameParent);
    }
}