import { AddressInput } from "../AddressInput/AddressInput";
import InfoIcon from "./InfoIcon";
import { Block } from "../../utils/bem";
import LocationData from "./LocationData";
import "./AddressExamples.css";
import examples from "./examples_data.js";

export const AddressExamples = ({ is_ping_mode = false }) => {
  return (
    <div style={{ color: "black" }}>
      <div>
        <h2>
          Note: you will encounter some ambiguous addresses. Consult the
          examples below for help.
        </h2>

        <p>
          <b>
            Your goal is to extract location data from messy address fields and
            then format the address of each location is a specific way. You are
            looking for the following pieces of information for each location:
          </b>
        </p>
        <ol>
          <li>
            USPS postal addresses, including secondary address information like
            apartment or suite numbers (e.g.{" "}
            <code>200 Vesey St, #400, New York, NY 10281</code>
          </li>
          <li>
            Place names, along with as much of a postal address as possible,
            e.g. <code>Securities Exchange Commission, NY 10281</code>
          </li>
          <li>
            Intersections, e.g.{" "}
            <code>West St and Fulton St, New York, NY 10281</code>
          </li>
          <li>
            Streets, e.g. <code>Empire State Trl, New York, NY 10080</code>
          </li>
        </ol>

        <p>
          <b>
            You don't need to find these places on a map or verify the data
            correctness.
          </b>{" "}
          Your task is to faithfully extract addresses from the messy input so
          that USPS or Google Maps could find them, but you don't need to find
          them yourself.
        </p>

        <h3>Instructions</h3>

        <ul>
          <li>
            Extract <b>all addresses</b> from messy address fields in the
            provided table. There may be multiple addresses.
          </li>
          <li>
            All of the addresses should be as valid as possible. Ideally, USPS
            would be able to deliver to the address. If a valid postal address
            isn't present, then someone should be able to find the location by
            typing the address you extract into Google Maps.
          </li>
          <li>
            Sometimes, multiple addresses will be specified in the input
            address. For these addresses, there are usually multiple distinct
            street addresses in one field. For addresses like this, the
            addresses usually all share the same city, state, and zip code.
          </li>
          <li>
            If the location is not in the US, check the "Is it a non-US
            location" checkbox. Do not cleanse these addresses.
          </li>
          <li>
            Addresses should be extracted in the order they appear in the input.
          </li>
          <li>Include all addresses, even if they are duplicates.</li>
          <li>
            Do not try to fix typos. You should only reorder words from the
            input or remove irrelevant text.
          </li>
          <li>
            Preserve the original casing and the original punctuation from the
            address.
          </li>
          <li>
            If an address contains ranges, units, or intersections, follow the
            detailed examples below to properly format the address.
          </li>
          <li>
            For addresses with a 9-digit zip code missing a "-" between the
            5-digit component and the 4-digit component, insert the "-".
          </li>
          <li>
            Remove any extraneous information that would not help USPS deliver
            to the address.
          </li>
          {is_ping_mode && (
            <li>
              If you can determine the location of the address at a resolution
              better than zip code, check the box "Better than 5-digit zip code
              resolution". For example, if the address only has a city, do{" "}
              <em>not</em> check that box.
            </li>
          )}
        </ul>

        {is_ping_mode && (
          <>
            <h3>Modifying the pre-populated addresses</h3>
            <p>
              Addresses have been pre-populated to make the task faster.{" "}
              <b>These addresses are only correct about 50% of the time.</b> You
              need to verify all of the pre-populated addresses for correctness.
              You will need to change, add, remove, and re-order addresses from
              the pre-populated list.
            </p>
          </>
        )}

        <h3>Adding new addresses</h3>
        <p>
          If you add a new address to the list, make sure it is in the correct
          order. The list of address fields you create should have use the same
          order as the addresses appear in the input, from top to bottom and
          from left to right. Make sure to correctly order any addresses you add
          using the Up and Down button on the left.
        </p>

        {is_ping_mode && (
          <>
            <h3>Checkbox: Best address</h3>
            <ul>
              <li>
                You should choose a best address even if you do not check
                "Better than 5-digit zip code resolution"
              </li>
            </ul>
          </>
        )}

        {is_ping_mode && (
          <>
            <h3>Checkbox: Better than 5-digit ZIP code resolution</h3>
            <ul>
              <li>
                If you can't identify a ZIP code or both a city and state, do
                not check the box. For example, if the only address you find is{" "}
                <code>123 Main St</code>, with no city/state/ZIP, do not check
                the box.
              </li>
              <li>
                If you can identify a full street address, you should check the
                box.
              </li>
              <li>
                If you can identify a specific intersection, you should check
                the box.
                <ul>
                  <li>
                    If the streets are not addressable, do not check the box.
                    E.g. do not check the box for `Schmidt Blocks 10 and 12,
                    Olympia, WA`.
                  </li>
                </ul>
              </li>
              <li>
                If you can identify a 9-digit ZIP code (e.g. `12345-6789`), you
                should check the box.
              </li>
              <li>
                If you can identify a unique place name/POI <em>and</em> a city
                or ZIP is provided (e.g. `Central Park, New York City`), you
                should check the box.
              </li>
              <li>
                If you can only identify a street and a city or ZIP:
                <ul>
                  <li>
                    If the street is a major highway (e.g. `I-80`), do not check
                    the box. The highway might span several miles within the
                    area.
                  </li>
                  <li>
                    If the street seems to be small residential road (e.g. `Oak
                    Brook Drive`), you should check the box.
                  </li>
                  <li>
                    For other streets with no street number or intersection,
                    check the box if it seems like the road name is unique and
                    is contained within one zip code.
                  </li>
                </ul>
              </li>
            </ul>
          </>
        )}

        <h3>How to format the address of each location</h3>
        <p>
          You are looking for the following pieces of information (keeping in
          mind there may be multiple locations within each table):
        </p>
        <ol>
          <li>Postal code: 5 digit ZIP or 5 digit ZIP + 4</li>
          <li>
            City: if city is missing, you may use county or other principal
            subdivision if available
          </li>
          <li>State</li>
          <li>
            Street Address: may be an address range like{" "}
            <code>252-259 East Street</code>
          </li>
          <li>
            Secondary address information, like unit number, suite number,
            building number
          </li>
          <li>Intersection</li>
          <li>
            Place name or Point of Interest Name, like "Walmart" or "Central
            Park"
          </li>
          <li>Country</li>
        </ol>

        <p>
          Each location you extract should have one or more of these fields.{" "}
          <b>
            If a country name is explicitly specified in the input address
            table, you should include it.
          </b>{" "}
        </p>
        <p>
          If some of the fields are missing, leave them out. If a full street
          address is missing, you should use an Intersection, Place name, or
          street name instead. See below for formatting examples.
        </p>

        <p>Examples:</p>
        <table className="format-examples">
          <thead>
            <tr>
              <th rowSpan={2} className="head">
                Input
              </th>
              <th colSpan={6} className="head">
                Fields you should extract
              </th>
            </tr>
            <tr>
              <th className="head small">Street Address</th>
              <th className="head small">Secondary address information</th>
              <th className="head small">City</th>
              <th className="head small">State</th>
              <th className="head small">Postal code</th>
              <th className="head small">Place name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <LocationData
                  data={{
                    Street: "200 Vesey St",
                    Unit: "# 400",
                    State: "NY",
                    City: "New York",
                    Zip: "10281"
                  }}
                  copyable={false}
                />
              </td>
              <td>200 Vesey St</td>
              <td># 400</td>
              <td>New York</td>
              <td>NY</td>
              <td>10281</td>
              <td />
            </tr>
            <tr className="notes">
              <td colSpan={7}></td>
            </tr>
            <tr>
              <td>
                <LocationData
                  data={{
                    Street: "200 Vesey St",
                    "Building Name": "Securities Exchange Commission",
                    Ste: "# 400",
                    State: "NY",
                    City: "New York",
                    Zip: "10281"
                  }}
                  copyable={false}
                />
              </td>
              <td>200 Vesey St</td>
              <td># 400</td>
              <td>New York</td>
              <td>NY</td>
              <td>10281</td>
              <td>Securities Exchange Commission</td>
            </tr>
            <tr>
              <td>
                <LocationData
                  data={{
                    Street: "200 Vesey St",
                    Unit: "",
                    State: "NY",
                    City: "New York",
                    Zip: "10281"
                  }}
                  copyable={false}
                />
              </td>
              <td>200 Vesey St</td>
              <td />
              <td>New York</td>
              <td>NY</td>
              <td>10281</td>
              <td />
            </tr>
            <tr className="notes">
              <td colSpan={7}></td>
            </tr>
            <tr>
              <td>
                <LocationData
                  data={{
                    "Building Name": "Securities Exchange Commission",
                    State: "NY",
                    City: "New York",
                    Zip: "10281"
                  }}
                  copyable={false}
                />
              </td>
              <td />
              <td />
              <td>New York</td>
              <td>NY</td>
              <td>10281</td>
              <td>Securities Exchange Commission</td>
            </tr>
            <tr className="notes">
              <td colSpan={7}>
                <p>
                  <InfoIcon height={20} width={20} />
                  Use a Place Name if a full postal address is not available.
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <LocationData
                  data={{
                    Street: "West St and Fulton St",
                    State: "NY",
                    City: "New York",
                    Zip: "10281"
                  }}
                  copyable={false}
                />
              </td>
              <td>West St & Fulton St</td>
              <td />
              <td>New York</td>
              <td>NY</td>
              <td>10281</td>
              <td />
            </tr>
            <tr className="notes">
              <td colSpan={7}>
                <p>
                  <InfoIcon height={20} width={20} />
                  We're given an intersection instead of a full postal address
                </p>
              </td>
            </tr>
            <tr>
              <td>
                <LocationData
                  data={{
                    Street: "Empire State Trl",
                    State: "NY",
                    City: "New York",
                    Zip: "10281"
                  }}
                  copyable={false}
                />
              </td>
              <td>Empire State Trl</td>
              <td />
              <td>New York</td>
              <td>NY</td>
              <td>10281</td>
              <td />
            </tr>
            <tr className="notes">
              <td colSpan={7}>
                <p>
                  <InfoIcon height={20} width={20} />
                  We're given a street instead of a full postal address
                </p>
              </td>
            </tr>
          </tbody>
        </table>

        <h3 className="output-title">Identifying intersections</h3>
        <ul>
          <li>
            An intersection consists of intersecting street names{" "}
            <b>and does not contain a street number or a street number range</b>
            .{" "}
          </li>
          <li>
            If an address has a street number or range,{" "}
            <b>do not format the addresses as an intersection</b>.
          </li>
          <li>
            An intersection address requires the name of the first street,
            followed by an intersection connector, followed by the name of the
            second street.
          </li>
          <li>
            Examples of intersection connectors can include <code>&</code>,{" "}
            <code>@</code>, <code>|</code>, <code>\</code>, and <code>/</code>
          </li>
          <li>
            Intersection examples:
            <ul>
              <li>
                <code>FM-518 @ Sunrise Blvd (Co. Rd 666/Smith)</code> - You
                should format this intersection as{" "}
                <code>FM-518 and Sunrise Blvd</code>. The intersection is{" "}
                <a href="https://www.bing.com/maps?osid=83bd4281-6e50-4f67-96b7-9d05e5d1441f&cp=29.558535~-95.365318&lvl=18.9&pi=0&imgid=d623e911-9611-40b6-a704-c10fb935357e&v=2&sV=2&form=S00027">
                  here
                </a>
                . <code>Co. Rd 666</code> and <code>Smith</code> are{" "}
                <a href="https://www.openstreetmap.org/way/445470606#map=18/29.55685/-95.36443">
                  other names
                </a>{" "}
                for <code>Sunrise Blvd</code> on the south side of{" "}
                <code>FM-518</code>
              </li>
              <li>
                <code>INTERS/o LONGWELL RD & CO RD 113 (ON CR 113)</code> - You
                should format this intersection as{" "}
                <code>LONGWELL RD and CO RD 113</code>
              </li>
              <li>
                <code>S R 67 (W ELK AVE) @ MILLSTREE / MCARTHUR</code> - You
                should format this intersection as{" "}
                <code>S R 67 and MILLSTREE</code>. The intersection is{" "}
                <a href="https://www.bing.com/maps?osid=f45f6d36-44b3-4687-8bbf-df6fce175946&cp=36.351052%7E-82.233061&lvl=18.1&imgid=eec65c96-4c0d-451a-8e50-f27dd9f5df8d&v=2&sV=2&form=S00027">
                  here
                </a>
                . <code>W ELK AVE</code> is an alternative name for{" "}
                <code>S R 67</code> and <code>MCARTHUR</code> is an alternative
                name for <code>MILLSTREE</code>.
              </li>
            </ul>
          </li>
        </ul>

        <h3>ZIP codes with fewer than 5 numbers</h3>
        <p>
          If you find a 3 or 4 digit ZIP code, add zeroes on the left of the ZIP
          code to make it 5 digits long.
        </p>
        <table>
          <thead>
            <tr>
              <th className="head">ZIP code</th>
              <th className="head">Corrected ZIP code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>735</td>
              <td>00735</td>
            </tr>
            <tr>
              <td>7310</td>
              <td>07310</td>
            </tr>
          </tbody>
        </table>

        <div>
          {examples.map((example, index) => {
            const descriptions = example.description.map((description, idx) => (
              <p
                key={idx}
                dangerouslySetInnerHTML={{ __html: description }}
              ></p>
            ));
            return (
              <div className="example" key={index}>
                <h3 className="output-title">Complete Example: {example.title}</h3>
                {example.description_position !== "after" && descriptions}
                <p>Input:</p>
                <table>
                  <thead>
                    <tr>
                      <th className="head">Header</th>
                      <th className="head">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(example.input).map((key, index) => {
                      return (
                        <tr key={index}>
                          <td className="head">{key}</td>
                          <td>{example.input[key]}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="output-title">Output:</p>
                <ol className="outputs">
                  {example.output.map((output, index) => {
                    return (
                      <Block name="address-manager" key={index}>
                        <AddressInput block={output} isReadonly={true} />
                      </Block>
                    );
                  })}
                </ol>
                {example.description_position === "after" && descriptions}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
