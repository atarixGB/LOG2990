import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog'
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ColorPaletteComponent } from './components/sidebar/colortool-components/color-palette/color-palette.component';
import { ColorSliderComponent } from './components/sidebar/colortool-components/color-slider/color-slider.component';
import { MainColorComponent } from './components/sidebar/colortool-components/main-color/main-color.component';
import { OpacityConfigComponent } from './components/sidebar/colortool-components/opacity-config/opacity-config.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        MainColorComponent,
        ColorPaletteComponent,
        ColorSliderComponent,
        OpacityConfigComponent,
    ],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, BrowserAnimationsModule, MatDialogModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
