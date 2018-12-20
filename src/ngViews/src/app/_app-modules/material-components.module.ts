import { NgModule } from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatCheckboxModule, MatProgressSpinnerModule,
    MatProgressBarModule, MatIconModule, MatSidenavModule, MatListModule,
    MatToolbarModule, MatMenuModule, MatPaginatorModule, MatSortModule,
    MatTableModule, MatDialogModule, MatSnackBarModule, MatSelectModule,
    MatPaginatorIntl, MatGridListModule, MatDatepickerModule, MatNativeDateModule,
    DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatChipsModule, MatAutocompleteModule, MatSlideToggleModule, MatDividerModule, MatTooltipModule, MatRadioModule,
} from '@angular/material';
import { LayoutModule } from '../../../node_modules/@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '../../../node_modules/@angular/forms';
import { CommonModule } from '../../../node_modules/@angular/common';
import { BasicDialogComponent } from '../_components/_dialogs/basic-dialog/basic-dialog.component';
import { MyMatPaginatorIntl } from '../_clases/paginator-intl.class';
import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';

const MY_FORMATS = {
    parse: {
        dateInput: 'll',
    },
    display: {
        dateInput: 'll',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'll',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@NgModule({
    declarations: [
        BasicDialogComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LayoutModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSelectModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatTooltipModule,
        MatRadioModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        LayoutModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatDialogModule,
        MatSnackBarModule,
        MatSelectModule,
        MatGridListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatTooltipModule,
        MatRadioModule
    ],
    entryComponents: [
        BasicDialogComponent
    ],
    providers: [
        { provide: MatPaginatorIntl, useClass: MyMatPaginatorIntl },
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
    ]
})

export class MaterialComponentsModule { }
