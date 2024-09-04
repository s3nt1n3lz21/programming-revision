import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
	exports: [
		MatButtonModule,
		MatChipsModule,
		MatInputModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatIconModule,
	]
})
export class MaterialModule {}
