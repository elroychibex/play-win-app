import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient, HttpEventType,  } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class CrudService {
  SERVICE_URL;
  REST_API_URL;
  URLL;
  naira = '&#8358;';
  emp_msg = {};
   headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //  options = new RequestOptions({ headers: headers });
  
  header = new HttpHeaders(
    {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  );

  

  /**
   * Log the user in http://localhost:8080/RebirthERP/api
   * @param username of the user
   * @param password of the user
   */
  login(username: string, password: string) {
  //  const token = this.http.post('http://env-5029635.atl.jelastic.vps-host.net/api/login',
   const token = this.http.post(this.REST_API_URL + 'login',
      'username=' + username + '&password=' + password, { headers: this.header });
      console.log()
      return token;
  }

  /**
   * Return true if user is logged in
   */
  isLoggedIn() {
    const token = localStorage.getItem('token');
    const accessRight = localStorage.getItem('role');
   // console.log(token);
    return token != null;
  }

  constructor(private http: HttpClient) {
   this.REST_API_URL = 'http://localhost:8080/OnlineScratchNWin/api/';
    this.emp_msg = { message: 'No data available' };
  }


  /**
   * 
   * @param object the table to get all data
   */
  getAll(object) {
    return this.http.get(this.REST_API_URL + '' + object)
      .pipe(map(res => res));
  }

  /**
   * 
   * @param object table to get
   * @param id id of the table which is the object
   */
  getByID(object, id) {
    return this.http.get(this.REST_API_URL + '' + object + '/' + id)
    .pipe(map(res => res));
  }

  getImage(object, id) {
    return this.http.get(this.REST_API_URL + '' + object + '/' + id)
    .pipe(map(res => res));
  }

  getByTwoParam(object, id, id2) {
    return this.http.get(this.REST_API_URL + '' + object + '/' + id + '/' + id2)
    .pipe(map(res => res));
  }

  
  /**
   * 
   * 
   * @param object table to save data in
   * @param data json data to save
   */
  saveData(object, data, id) {
    if (id === 0) {
      return this.http.post(this.REST_API_URL + '' + object, data, {headers : this.headers})
      .pipe(map(res => res));
    } else {
      return this.http.put(this.REST_API_URL + '' + object + '', data)
      .pipe(map(res => res));
    }
  }



  /**
  * 
  * @param object table to save data in
  * @param data json data to save
  */
  updateData(object, data) {
    return this.http.put(this.REST_API_URL + object, data)
    .pipe(map(res => res));
  }

  /**
   * 
   * @param object table to delete from
   * @param id table id row to delete
   */
  deleteData(object, id) {
    return this.http.delete(this.REST_API_URL + object + '/' + id)
    .pipe(map(res => res));
  }
  /**
   * 
   * @param table database table to get
   * @param id primary key id of the table
   */
  getNameByID(table, id) {
    return this.http.get(this.REST_API_URL + table + '/' + id)
    .pipe(map(res => res));
  }

  // Provide notification after action
  /**
   * 
   * @param type type of notification 'info','success','warning','danger'
   * @param message message to display
   */
  // showNotification(type, message) {
  //   // const type = ['','info','success','warning','danger'];

  //   //  const color = Math.floor((Math.random() * 4) + 1);

  //   $.notify({
  //     icon: 'notifications',
  //     message: message

  //   }, {
  //       type: type,
  //       timer: 4000,
  //       placement: {
  //         from: 'top',
  //         align: 'center'
  //       }
  //     });
  // }

  /**
   * 
   * @param selectedFile File Stream object
   * @param datas Form parameter in array object format
   * @param restPath  path to the restful web service
   */
  fileUpload(selectedFile, datas, restPath) {
    const fd = new FormData();
    fd.append('upload', selectedFile);
    fd.append('data', JSON.stringify(datas));
    console.log(JSON.stringify(datas));
    return this.http.post(this.REST_API_URL + restPath, fd, {
      reportProgress: true,
      observe: 'events'
    })
    .pipe(map(res => res));
  }

  fileUpload2(selectedFile) {
    const fd = new FormData();
    const str = { id: 4, name: 'King', age: 35 };
    // var json = JSON.stringify(str);
    fd.append('emp', JSON.stringify(str));
    fd.append('upload', selectedFile);
    return this.http.post(this.REST_API_URL + 'savefile/upload', fd, {
      reportProgress: true,
      observe: 'events'
    }).
     pipe(map(data => data));
  }
}
