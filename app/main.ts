import {bootstrap} from 'angular2/platform/browser';
import {Component} from 'angular2/core';
import {BemDirective} from '../src/bem';

@Component({
    selector: 'my-app',
    template: `
        selected: <input type="checkbox" [(ngModel)]="selected">
        obj.a: <input type="checkbox" [(ngModel)]="obj.a">
        obj.b: <input type="checkbox" [(ngModel)]="obj.b">
        obj.c: <input type="checkbox" [(ngModel)]="obj.c">
        <div bem="foo" [--]="{selected: selected}">
            foo
            <div *ngIf="selected" bem="__bar" [--]="obj">
                foo__bar
                <div bem="__baz" [--]="{selected: selected}">
                    foo__bar__baz
                </div>
            </div>
        </div>
    `,
    styles: [
        `
        .foo {
            font-size: 24px;
        }
        .foo--selected {
            color: red;
        }
        
        .foo__bar {
            font-size: 18px;
        }
        .foo__bar--a {
            font-weight: bold;
        }
        .foo__bar--b {
            color: blue;
        }
        .foo__bar--c {
            font-style: italic
        }
        
        .foo__bar__baz {
            font-size: 14px;
        }
        .foo__bar__baz--selected {
            color: green;
        }
        `
    ],
    directives: [BemDirective]
})
class AppComponent {
    selected = false;
    obj = {
        a: true,
        b: true,
        c: false
    };
}

bootstrap(AppComponent);