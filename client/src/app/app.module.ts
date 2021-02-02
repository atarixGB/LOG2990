import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { FileMenuComponent } from './components/sidebar/file-menu/file-menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToolsListComponent } from './components/sidebar/tools-list/tools-list.component';

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
        FileMenuComponent, 
        ToolsListComponent
    ],
    imports: [
        BrowserModule, 
        HttpClientModule, 
        AppRoutingModule, 
        BrowserAnimationsModule, 
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatGridListModule,
        MatTooltipModule,],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
