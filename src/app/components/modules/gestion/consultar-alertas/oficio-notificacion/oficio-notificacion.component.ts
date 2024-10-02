import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { EditorModule } from 'primeng/editor';
import { EAPB } from '../../../../../models/eapb.model';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { GenericService } from '../../../../../services/generic.services';

@Component({
  selector: 'app-oficio-notificacion',
  templateUrl: './oficio-notificacion.component.html',
  standalone: true,
  imports: [
    CommonModule, BadgeModule, CardModule, TableModule, RouterModule, ButtonModule, DividerModule, ReactiveFormsModule,
    FormsModule, EditorModule
  ],
  styleUrls: ['./oficio-notificacion.component.css'],
  providers: [MessageService]
})
export class OficioNotificacionComponent implements OnInit {

  today: Date;
  formattedDate: string;
  city: string;
  idAlerta: any;

  @Input() alerta: any;
  @Input() NNAdatos: any;
  @Input() nombreNNA: any;
  @Input() edadNNA: any;
  @Input() diagnosticoNNA: any;

  membrete: string ='';
  listaEndidades: any[] = [];
  ciudad: string ='';
  asunto: string ='';
  mensaje: string ='';
  comentario1: string ='';
  cierre: string ='';
  firma: string ='';


  constructor(
    private route: ActivatedRoute,
    private repos: GenericService
  ) {
    this.today = new Date();
    this.formattedDate = this.formatDate(this.today);
    this.city = 'Bogota';
  }

  ngOnInit() {

    this.loadAlertaData();

  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('es-ES', options);
  }

  loadAlertaData(){


    this.repos.get_withoutParameters(`Entidades/Entidades`, 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEndidades = data;
      },
      error: (err: any) => console.error('Error al cargar seguimiento', err)
    });
  }





  generarPDF() {
    const doc = new jsPDF();
    const pageWidth = 180;
    const startY = 10;
    let currentY = startY;

    currentY = this.addText(doc, `${this.city}, ${this.formattedDate}`, currentY);
    currentY = this.addText(doc, `${this.membrete}`, currentY);
    currentY = this.addText(doc, `entida00003`, currentY); // Valor dinámico
    currentY = this.addText(doc, `${this.asunto}`, currentY);

    // Manejo del salto de línea para el mensaje largo
    currentY = this.addText(doc, ``, currentY);
    currentY = this.addMultilineText(doc, this.mensaje, currentY, pageWidth, doc);

    // Comentario 1
    currentY = this.addText(doc, ``, currentY);
    currentY = this.addMultilineText(doc, this.comentario1, currentY, pageWidth, doc);

    // Datos del NNA
    currentY = this.addText(doc, `Nombres y apellidos: ${this.nombreNNA}`, currentY);
    currentY = this.addText(doc, `Identificación: ${this.NNAdatos.tipoIdentificacionId} ${this.NNAdatos.numeroIdentificacion}`, currentY);
    currentY = this.addText(doc, `Edad: ${this.edadNNA}`, currentY);
    currentY = this.addText(doc, `Diagnostico: ${this.diagnosticoNNA}`, currentY);
    currentY = this.addText(doc, `Teléfono del acudiente: ${this.NNAdatos.cuidadorTelefono}`, currentY);

    // Manejo del salto de línea para el cierre
    currentY = this.addText(doc, ``, currentY);
    currentY = this.addMultilineText(doc, this.cierre, currentY, pageWidth, doc);

    // Firma
    currentY = this.addText(doc, ``, currentY);
    currentY = this.addMultilineText(doc, this.firma, currentY, pageWidth, doc);

    const content = document.querySelector<HTMLElement>('#content');

    if (content) {
      html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 10, currentY, pageWidth, 0);
      });
    } else {
      console.error('No se pudo encontrar el contenido para el PDF.');
    }

    // Guardar el PDF
    doc.save('notificacion.pdf');
  }

  // Método para agregar texto y retornar la nueva posición Y
  private addText(doc: jsPDF, text: string, y: number): number {
    if (y > 280) { // Cambia a nueva página si y supera el límite
      doc.addPage();
      y = 10; // Reiniciar Y
    }
    doc.text(text, 10, y);
    return y + 10; // Aumentar 10 mm para la siguiente línea
  }

  // Método para agregar texto en múltiples líneas y retornar la nueva posición Y
  private addMultilineText(doc: jsPDF, text: string, y: number, maxWidth: number, pdfDoc: jsPDF): number {
    const splitText = doc.splitTextToSize(text, maxWidth);
    const lineHeight = 10; // Altura de cada línea

    splitText.forEach((line: string) => {
      if (y > 280) { // Cambia a nueva página si y supera el límite
        pdfDoc.addPage();
        y = 10; // Reiniciar Y
      }
      doc.text(line, 10, y);
      y += lineHeight; // Aumentar la posición Y por la altura de la línea
    });

    return y; // Retorna la nueva posición Y después de agregar el texto
  }


  generarPDF2(){
    console.log(this.firma);
  }


}
