import { Component,NgModule } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner,BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { TarjetasService }  from '../servicios/tarjetas.service';
import { Timestamp } from 'rxjs';


interface tarjeta
{
  id : String
  Cliente : String
  CodigoTarjeta : String
  FechaVencimiento : String
  Identificacion : String
  Puntos : String
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  barcodenumber : String;
  consultabarcodenumber : String;
  public tarjetaconsultada : any = [];
  private barcodeScannerOptions : BarcodeScannerOptions
  public coleccionTarjetas : any = [];
  constructor(
    private barcodeScanner: BarcodeScanner, private ts : TarjetasService
    ) 
  {
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true,
      orientation : "landscape"
    };
  }

  ConsultarBarCode()
  {
    this.ts.ObtenerTarjeta().subscribe(tarjetas=>{
      this.coleccionTarjetas =[];
      this.tarjetaconsultada =[];
      tarjetas.map(tarjeta => 
      {
        const data : tarjeta = tarjeta.payload.doc.data() as tarjeta;
        //console.log(data);
        data.id = tarjeta.payload.doc.id;
        this.coleccionTarjetas.push(data);
      }  
      );

      this.coleccionTarjetas.forEach(Tarjeta => {
        console.log(Tarjeta.CodigoTarjeta +":"+ this.barcodenumber)
        if (Tarjeta.CodigoTarjeta == this.barcodenumber)
        {
          console.log("Capturada"+Tarjeta)
          this.tarjetaconsultada.push(Tarjeta);
        }
      });
      
      if (!this.tarjetaconsultada)
      {
        alert("904-No existen datos para esta consulta.")
      }
    }
    );
  }





  async EscanearBarCode()
  {
    this.barcodeScanner.scan().then(barcodeData => {
      this.barcodenumber = barcodeData.text;
      this.tarjetaconsultada = [];
      this.coleccionTarjetas = [];
     }).catch(err => {
         alert("'Barcode data"+ err);
     });
  }
  /*
  EscanearQR()
  {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));

  }
*/

}
