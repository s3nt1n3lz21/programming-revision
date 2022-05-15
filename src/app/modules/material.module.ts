import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
	exports: [
		MatChipsModule,
		MatInputModule,
		MatAutocompleteModule,
		MatIconModule,
	]
})
export class MaterialModule {}
